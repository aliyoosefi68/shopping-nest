import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "../entities/blog.entity";
import { DataSource, Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from "../dto/blog.dto";
import { S3Service } from "src/modules/s3/s3.service";
import { isArray } from "class-validator";
import { createSlug, randomId } from "src/common/utils/function.util";
import { BlogStatus } from "../enums/status.enum";
import { CategoryBlogService } from "src/modules/category-blog/category-blog.service";
import { BlogCategoryEntity } from "../entities/blog-category.entity";
import {
  paginationSolver,
  pagintionGenerator,
} from "src/common/utils/pagination.util";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { BlogLikesEntity } from "../entities/blog-like.entity";
import { BlogBookmarkEntity } from "../entities/bookmark.entity";
import { BlogCommentService } from "./comment.service";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogLikesEntity)
    private blogLikeRepository: Repository<BlogLikesEntity>,
    @InjectRepository(BlogBookmarkEntity)
    private blogBookmarkRepository: Repository<BlogBookmarkEntity>,
    private s3Service: S3Service,
    private categoryService: CategoryBlogService,
    private blogCommentService: BlogCommentService,
    @Inject(REQUEST) private request: Request,
    private dataSource: DataSource,

    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>
  ) {}

  async create(blogDto: CreateBlogDto, image: Express.Multer.File) {
    const user = await this.request.user;
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      "shop-image"
    );
    let { title, slug, content, description, time_for_study, categories } =
      blogDto;

    if (!isArray(categories) && typeof categories === "string") {
      categories = categories.split(",");
    } else if (!isArray(categories)) {
      throw new BadRequestException("دسته بندی ها را به درستی وارد کنید");
    }

    let slugData = slug ?? title;
    slug = createSlug(slugData);
    const isExist = await this.checkBlogBySlug(slug);
    if (isExist) {
      slug += `-${randomId()}`;
    }

    let blog = this.blogRepository.create({
      title,
      slug,
      description,
      content,
      image: Location,
      imageKey: Key,
      status: BlogStatus.Draft,
      time_for_study,
      authorId: user.id,
    });
    blog = await this.blogRepository.save(blog);
    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.insertByTitle(categoryTitle);
      }
      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }
    return {
      message: "مقاله شما با موفقیت ایجاد شد",
    };
  }

  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return blog;
  }

  async myBlog() {
    const { id } = this.request.user;
    return this.blogRepository.find({
      where: {
        authorId: id,
      },
      order: {
        id: "DESC",
      },
    });
  }

  async blogList(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
    const { limit, page, skip } = paginationSolver(
      paginationDto.page,
      paginationDto.limit
    );
    let { category, search } = filterDto;
    let where = "";
    if (category) {
      category = category.toLowerCase();
      if (where.length > 0) where += " AND ";
      where += "category.title = LOWER(:category)";
    }
    if (search) {
      if (where.length > 0) where += " AND ";
      search = `%${search}%`;
      where +=
        "CONCAT(blog.title, blog.description, blog.content) ILIKE :search";
    }
    const [blogs, count] = await this.blogRepository
      .createQueryBuilder("blog")
      .leftJoin("blog.categories", "categories")
      .leftJoin("categories.category", "category")
      .leftJoin("blog.author", "author")
      .leftJoin("author.profile", "profile")
      .addSelect([
        "categories.id",
        "category.title",
        "author.username",
        "author.id",
        "profile.nick_name",
      ])
      .where(where, { category, search })
      .loadRelationCountAndMap("blog.likes", "blog.likes")
      .loadRelationCountAndMap("blog.bookmarks", "blog.bookmarks")
      .loadRelationCountAndMap(
        "blog.comments",
        "blog.comments",
        "comments",
        (qb) => qb.where("comments.accepted = :accepted", { accepted: true })
      )
      .orderBy("blog.id", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // const [blogs, count] = await this.blogRepository.findAndCount({
    //     relations: {
    //         categories: {
    //             category: true
    //         }
    //     },
    //     where,
    //     select: {
    //         categories: {
    //             id: true,
    //             category: {
    //                 title: true
    //             }
    //         }
    //     },
    //     order: {
    //         id: "DESC"
    //     },
    //     skip,
    //     take: limit
    // });
    return {
      pagination: pagintionGenerator(count, page, limit),
      blogs,
    };
  }

  async checkExistBlogById(id: number) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) throw new NotFoundException("مقاله مورد نظر یافت نشد");
    return blog;
  }
  async delete(id: number) {
    await this.checkExistBlogById(id);
    await this.blogRepository.delete({ id });
    return {
      message: "مقاله شما با موفقیت حذف شد",
    };
  }

  async update(id: number, blogDto: UpdateBlogDto, image: Express.Multer.File) {
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      "shop-image"
    );
    const user = this.request.user;
    let { title, slug, content, description, time_for_study, categories } =
      blogDto;
    const blog = await this.checkExistBlogById(id);
    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        "shop-image"
      );
      if (Location) {
        if (blog?.imageKey) await this.s3Service.deleteFile(blog?.imageKey);
        blog.image = Location;
        blog.imageKey = Key;
      }
    }
    if (!isArray(categories) && typeof categories === "string") {
      categories = categories.split(",");
    } else if (!isArray(categories)) {
      throw new BadRequestException("فرمت ورودی برای دسته بندی ها درست نیست");
    }
    let slugData = null;
    if (title) {
      slugData = title;
      blog.title = title;
    }
    if (slug) slugData = slug;

    if (slugData) {
      slug = createSlug(slugData);
      const isExist = await this.checkBlogBySlug(slug);
      if (isExist && isExist.id !== id) {
        slug += `-${randomId()}`;
      }
      blog.slug = slug;
    }
    if (description) blog.description = description;
    if (content) blog.content = content;
    if (time_for_study) blog.time_for_study = time_for_study;
    await this.blogRepository.save(blog);
    if (categories && isArray(categories) && categories.length > 0) {
      await this.blogCategoryRepository.delete({ blogId: blog.id });
    }
    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.insertByTitle(categoryTitle);
      }
      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }
    return {
      message: "بروز رسانی مقالات با موفقیت انجام شد",
    };
  }

  async likeToggle(blogId: number) {
    const { id: userId } = this.request.user;
    const blog = await this.checkExistBlogById(blogId);
    const isLiked = await this.blogLikeRepository.findOneBy({ userId, blogId });
    let message = "مقاله شما با موفقیت لایک شد";
    if (isLiked) {
      await this.blogLikeRepository.delete({ id: isLiked.id });
      message = "مقاله شما دیس لایک شد";
    } else {
      await this.blogLikeRepository.insert({
        blogId,
        userId,
      });
    }
    return { message };
  }

  async bookmarkToggle(blogId: number) {
    const { id: userId } = this.request.user;
    const blog = await this.checkExistBlogById(blogId);
    const isBookmarked = await this.blogBookmarkRepository.findOneBy({
      userId,
      blogId,
    });
    let message = "مقاله شما بوک مارک شد";
    if (isBookmarked) {
      await this.blogBookmarkRepository.delete({ id: isBookmarked.id });
      message = "مقاله شما از بوک مارک خارج شد";
    } else {
      await this.blogBookmarkRepository.insert({
        blogId,
        userId,
      });
    }
    return { message };
  }

  async findOneBySlug(slug: string, paginationDto: PaginationDto) {
    const userId = this.request?.user?.id;
    const blog = await this.blogRepository
      .createQueryBuilder("blog")
      .leftJoin("blog.categories", "categories")
      .leftJoin("categories.category", "category")
      .leftJoin("blog.author", "author")
      .leftJoin("author.profile", "profile")
      .addSelect([
        "categories.id",
        "category.title",
        "author.username",
        "author.id",
        "profile.nick_name",
      ])
      .where({ slug })
      .loadRelationCountAndMap("blog.likes", "blog.likes")
      .loadRelationCountAndMap("blog.bookmarks", "blog.bookmarks")
      .getOne();
    if (!blog) throw new NotFoundException("مقاله مورد نظر یافت نشد");
    const commentsData = await this.blogCommentService.findCommentsOfBlog(
      blog.id,
      paginationDto
    );
    let isLiked = false;
    let isBookmarked = false;
    if (userId && !isNaN(userId) && userId > 0) {
      isLiked = !!(await this.blogLikeRepository.findOneBy({
        userId,
        blogId: blog.id,
      }));
      isBookmarked = !!(await this.blogBookmarkRepository.findOneBy({
        userId,
        blogId: blog.id,
      }));
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const suggestBlogs = await queryRunner.query(`
          WITH suggested_blogs AS (
              SELECT
                  blog.id,
                  blog.slug,
                  blog.title,
                  blog.description,
                  blog.time_for_study,
                  blog.image,
                  json_build_object(
                      'username', u.username,
                      'author_name', p.nick_name,
                      'image', p.image_profile
                  ) AS author,
                  array_agg(DISTINCT cat.title) AS categories,
                  (
                      SELECT COUNT(*) FROM blog_likes
                      WHERE blog_likes."blogId" = blog.id
                  ) AS likes,
                  (
                      SELECT COUNT(*) FROM blog_bookmarks
                      WHERE blog_bookmarks."blogId" = blog.id
                  ) AS bookmarks,
                  (
                      SELECT COUNT(*) FROM blog_comments
                      WHERE blog_comments."blogId" = blog.id
                  ) AS comments
              FROM blog
              LEFT JOIN public.user u ON blog."authorId" = u.id
              LEFT JOIN profile p ON p."userId" = u.id
              LEFT JOIN blog_category bc ON blog.id = bc."blogId"
              LEFT JOIN category cat ON bc."categoryId" = cat.id
              GROUP BY blog.id, u.username, p.nick_name, p.image_profile
              ORDER BY RANDOM()
              LIMIT 3

          )
          SELECT * FROM suggested_blogs
      `);
    return {
      blog,
      isLiked,
      isBookmarked,
      commentsData,
      suggestBlogs,
    };
  }
}
