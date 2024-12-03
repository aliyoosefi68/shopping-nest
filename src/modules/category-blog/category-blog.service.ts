import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryBlogEntity } from "./entity/category-blog.entity";
import { Repository } from "typeorm";
import {
  CreateCategoryBlogDto,
  UpdateCategoryBlogDto,
} from "./dto/category-blog.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import {
  paginationSolver,
  pagintionGenerator,
} from "src/common/utils/pagination.util";

@Injectable()
export class CategoryBlogService {
  constructor(
    @InjectRepository(CategoryBlogEntity)
    private categoryRepository: Repository<CategoryBlogEntity>
  ) {}

  async create(createDto: CreateCategoryBlogDto) {
    let { priority, title } = createDto;
    title = await this.checkExistAndResolveTitle(title);
    const category = this.categoryRepository.create({
      title,
      priority,
    });
    await this.categoryRepository.save(category);
    return {
      message: "دسته بندی شما با موفقیت ایجاد شد",
    };
  }

  async checkExistAndResolveTitle(title: string) {
    title = title?.trim()?.toLowerCase();
    const category = await this.categoryRepository.findOneBy({ title });
    if (category)
      throw new ConflictException("این دسته بندی از قبل وجود دارد!");
    return title;
  }

  async findAll(paginationDto: PaginationDto) {
    let { page: pageDto, limit: limitDto } = paginationDto;

    const { limit, page, skip } = paginationSolver(pageDto, limitDto);
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      skip,
      take: limit,
    });
    return {
      pagination: pagintionGenerator(count, page, limit),
      categories,
    };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException("دسته بندی مورد نظر یافت نشد");
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryBlogDto) {
    const category = await this.findOne(id);
    const { priority, title } = updateCategoryDto;
    if (title) category.title = title;
    if (priority) category.priority = priority;
    await this.categoryRepository.save(category);
    return {
      message: "دسته بندی با موفقیت بروز رسانی شد",
    };
  }
  async remove(id: number) {
    await this.findOne(id);
    await this.categoryRepository.delete({ id });
    return {
      message: "دسته بندی با موفقیت حذف شد",
    };
  }

  async insertByTitle(title: string) {
    const category = this.categoryRepository.create({
      title,
    });
    return await this.categoryRepository.save(category);
  }

  async findOneByTitle(title: string) {
    title = title?.trim()?.toLowerCase();
    return await this.categoryRepository.findOneBy({ title });
  }
}
