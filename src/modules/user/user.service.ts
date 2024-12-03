import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { DeepPartial, Repository } from "typeorm";
import { ProfileDto } from "./dto/profile.dto";
import { S3Service } from "../s3/s3.service";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { ProfileEntity } from "./entity/profile.entity";
import { isDate } from "class-validator";
import { Gender } from "./enum/gender.enum";
import { AuthService } from "../auth/auth.service";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    private s3Service: S3Service,
    private authService: AuthService,
    @Inject(REQUEST) private request: Request
  ) {}

  async changeProfile(profileDto: ProfileDto, image: Express.Multer.File) {
    const { id: userId, profileId } = this.request.user;
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      "shop-image"
    );
    const { bio, birthday, gender, linkedin_profile, nick_name, x_profile } =
      profileDto;

    let profile = await this.profileRepository.findOneBy({ userId });

    if (profile) {
      if (image) {
        const { Location, Key } = await this.s3Service.uploadFile(
          image,
          "shop-image"
        );
        if (Location) {
          if (profile?.profile_imageKey)
            await this.s3Service.deleteFile(profile?.profile_imageKey);
          profile.profile_image = Location;
          profile.profile_imageKey = Key;
        }
      }
      if (nick_name) profile.nick_name = nick_name;
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday)))
        profile.birthday = new Date(birthday);
      if (gender && Object.values(Gender as any).includes(gender))
        profile.gender = gender;
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (x_profile) profile.x_profile = x_profile;
    } else {
      profile = this.profileRepository.create({
        nick_name,
        bio,
        birthday,
        gender,
        linkedin_profile,
        x_profile,
        userId,
        profile_imageKey: Key,
        profile_image: Location,
      });
    }
    profile = await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update(
        { id: userId },
        { profileId: profile.id }
      );
    }
    return {
      message: "پروفایل با موفقیت بروزرسانی شد",
    };
  }

  profile() {
    const { id } = this.request.user;
    return (
      this.userRepository
        .createQueryBuilder("user")
        .where({ id })
        .leftJoinAndSelect("user.profile", "profile")
        // .loadRelationCountAndMap("user.followers", "user.followers")
        // .loadRelationCountAndMap("user.following", "user.following")
        .getOne()
    );
  }
  //
  //
  //----------------------change phone---------------------------------
}
