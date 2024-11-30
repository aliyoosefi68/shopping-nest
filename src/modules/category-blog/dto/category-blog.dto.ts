import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class CreateCategoryBlogDto {
  @ApiProperty()
  title: string;
  @ApiPropertyOptional()
  priority: number;
}
export class UpdateCategoryBlogDto extends PartialType(CreateCategoryBlogDto) {}
