import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CatagoryProductService } from "./category.service";
import { FormType } from "src/common/enum/formType.enum";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { Pagination } from "src/common/decorator/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { UploadFilesS3 } from "src/common/interceptors/upload-file.interceptor";
import { AuthDecorator } from "src/common/decorator/auth.decorator";

@Controller("category-product")
@ApiTags("Category-Product")
export class CategoryController {
  constructor(private readonly categoryService: CatagoryProductService) {}

  @Post()
  @AuthDecorator()
  @ApiConsumes(FormType.Multipart)
  @UseInterceptors(UploadFilesS3("image"))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpg|webp|jpeg)" }),
        ],
      })
    )
    image: Express.Multer.File,
    @Body()
    createDto: CreateCategoryDto
  ) {
    return this.categoryService.create(createDto, image);
  }

  @Get()
  @Pagination()
  findAll(@Query() pagination: PaginationDto) {
    return this.categoryService.findAll(pagination);
  }

  @Get("/by-slug/:slug")
  findBySlug(@Param("slug") slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Patch(":id")
  @ApiConsumes(FormType.Multipart)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
        ],
      })
    )
    image: Express.Multer.File
  ) {
    return this.categoryService.update(+id, updateDto, image);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
