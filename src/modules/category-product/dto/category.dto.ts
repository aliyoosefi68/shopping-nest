import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  slug: string;
  @ApiPropertyOptional({ nullable: true, format: "binary" })
  image: string;
  @ApiProperty({ type: "boolean" })
  show: boolean;
  @ApiPropertyOptional({ nullable: true })
  parentId: number;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
