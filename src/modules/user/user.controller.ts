import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { ProfileDto } from "./dto/profile.dto";
import { UploadFilesS3 } from "src/common/interceptors/upload-file.interceptor";
import { FormType } from "src/common/enum/formType.enum";
import { AuthDecorator } from "src/common/decorator/auth.decorator";

@Controller("/user")
@ApiTags("User")
@AuthDecorator()
export class userController {
  constructor(private readonly userService: UserService) {}

  @Put("/profile")
  @ApiConsumes(FormType.Multipart)
  @UseInterceptors(UploadFilesS3("image"))
  changeProfile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpg|webp|jpeg)" }),
        ],
      })
    )
    image: Express.Multer.File,
    @Body() profileDto: ProfileDto
  ) {
    return this.userService.changeProfile(profileDto, image);
  }

  @Get("/profile")
  profile() {
    return this.userService.profile();
  }
}
