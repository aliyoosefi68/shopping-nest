import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryProductEntity } from "./entity/category.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { isBoolean } from "class-validator";
import { toBoolean } from "src/common/utils/function.util";
import { PaginationDto } from "src/common/dto/pagination.dto";
import {
  paginationSolver,
  pagintionGenerator,
} from "src/common/utils/pagination.util";
import { S3Service } from "../s3/s3.service";

@Injectable()
export class CatagoryProductService {
  constructor(
    @InjectRepository(CategoryProductEntity)
    private categoryRepository: Repository<CategoryProductEntity>,
    private s3Service: S3Service
  ) {}

  async create(categoryDto: CreateCategoryDto, image: Express.Multer.File) {
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      "shop-image"
    );
    let { title, slug, show, parentId } = categoryDto;
    const category = await this.findOneBySlug(slug);
    if (category) throw new ConflictException("already exist category!");
    if (isBoolean(show)) {
      show = toBoolean(show);
    }
    let parent: CategoryProductEntity = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.findOneById(+parentId);
    }

    await this.categoryRepository.insert({
      title,
      slug,
      show,
      image: Location,
      imageKey: Key,
      parentId: parent?.id,
    });

    return {
      message: "Created Category successfully",
    };
  }

  async findAll(pagination: PaginationDto) {
    const { page, limit, skip } = paginationSolver(
      pagination.page,
      pagination.limit
    );
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      relations: {
        parent: true,
      },
      select: {
        parent: {
          title: true,
        },
      },
      skip,
      take: limit,
      order: { id: "DESC" },
    });
    return {
      pagination: pagintionGenerator(count, page, limit),
      categories,
    };
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File
  ) {
    const { parentId, show, slug, title } = updateCategoryDto;
    const category = await this.findOneById(id);
    const updateObject: DeepPartial<CategoryProductEntity> = {};
    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        "shop-image"
      );
      if (Location) {
        updateObject["image"] = Location;
        updateObject["imageKey"] = Key;
        if (category?.imageKey)
          await this.s3Service.deleteFile(category?.imageKey);
      }
    }
    if (title) updateObject["title"] = title;
    if (show && isBoolean(show)) updateObject["show"] = toBoolean(show);
    if (parentId && !isNaN(parseInt(parentId.toString()))) {
      const category = await this.findOneById(+parentId);
      if (!category) throw new NotFoundException("not found category parent");
      updateObject["parentId"] = category.id;
    }
    if (slug) {
      const category = await this.categoryRepository.findOneBy({ slug });
      if (category && category.id !== id)
        throw new ConflictException("already exist category slug");
      updateObject["slug"] = slug;
    }

    await this.categoryRepository.update({ id }, updateObject);
    return {
      message: "updated successfully",
    };
  }

  async findOneBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({ slug });
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: {
        children: true,
      },
    });
    if (!category) throw new NotFoundException("not found this category slug ");
    return {
      category,
    };
  }

  async remove(id: number) {
    const category = await this.findOneById(id);
    await this.categoryRepository.delete({ id });
    return {
      message: "deleted successfully",
    };
  }

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException("دسته بندی مورد نظر پیدا نشد");
    return category;
  }
}
