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
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { BlogService } from "../services/blog.service";
import { FormType } from "src/common/enum/formType.enum";
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from "../dto/blog.dto";
import { AuthDecorator } from "src/common/decorator/auth.decorator";
import { SkipAuth } from "src/common/decorator/skip-auth.decorator";
import { Pagination } from "src/common/decorator/pagination.decorator";
import { UploadFilesS3 } from "src/common/interceptors/upload-file.interceptor";
import { FilterBlog } from "src/common/decorator/filter.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Controller("blog")
@ApiTags("Blog")
@AuthDecorator()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post("/")
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
    @Body() blogDto: CreateBlogDto
  ) {
    return this.blogService.create(blogDto, image);
  }

  @Get("/my")
  myBlogs() {
    return this.blogService.myBlog();
  }

  @Get("/")
  @SkipAuth()
  @Pagination()
  @FilterBlog()
  find(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterBlogDto
  ) {
    return this.blogService.blogList(paginationDto, filterDto);
  }

  @Get("/like/:id")
  likeToggle(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.likeToggle(id);
  }

  @Get("/bookmark/:id")
  bookmarkToggle(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.bookmarkToggle(id);
  }

  @Put("/:id")
  @ApiConsumes(FormType.Multipart)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() blogDto: UpdateBlogDto,
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
    return this.blogService.update(id, blogDto, image);
  }

  @Delete("/:id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.delete(id);
  }
}
