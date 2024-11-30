import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from "@nestjs/common";

import { ApiConsumes, ApiTags } from "@nestjs/swagger";

import { PaginationDto } from "src/common/dto/pagination.dto";
import { Pagination } from "src/common/decorator/pagination.decorator";
import { FormType } from "src/common/enum/formType.enum";
import {
  CreateCategoryBlogDto,
  UpdateCategoryBlogDto,
} from "./dto/category-blog.dto";
import { CategoryBlogService } from "./category-blog.service";

@Controller("category-blog")
@ApiTags("Category Blog")
export class CategoryBlogController {
  constructor(private readonly categoryService: CategoryBlogService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() createCategoryDto: CreateCategoryBlogDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(":id")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryBlogDto
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
