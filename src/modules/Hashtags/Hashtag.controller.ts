/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Created Hashtag Controller
 *
 * @author Devesh
 */

import 'reflect-metadata';
import { Controller, Post, Get, Put, Delete, Body, UseInterceptors, Param, UseFilters, UsePipes } from '@nestjs/common';
import { Hashtags } from '../../database/entity/hashtag';
import { HashtagService } from './Hashtag.service';
import { CreateHashtagDto, UpdateHashtagDto } from './dto';
import { LoggerService } from '../../shared/services/logger.service';
import { CacheInterceptor } from '../../interceptors/cache.interceptor';
import { RedisService } from '../../shared/services/redis.service';
import { UndefinedInterceptor } from '../../interceptors/undefined.interceptor';
import { CacheExpiration } from '../../decorators/cache-expiration.decorators';
import { QueryFailedFilter } from '../../filters/queryfailed.filter';
import { ValidationPipe } from '../../pipes/validation.pipe';

// Controller for Hashtags
@Controller('Hashtags')
export class HashtagController {
	constructor(
		private readonly HashtagService: HashtagService,
		private Logger: LoggerService,
		private cache: RedisService
	) {}

	// method to get it by id
	@Get('get/:id')
	@CacheExpiration(15)
	@UseInterceptors(CacheInterceptor)
	@UseFilters(new QueryFailedFilter())
	async getHashtag(@Param('id') HashtagId: number) {
		const Hashtag = await this.HashtagService.findById(HashtagId);
		console.log(Hashtag);
		return Hashtag ? { Hashtag } : Hashtag;
	}

	// method to add a Hashtag
	@Post('add')
	@UsePipes(ValidationPipe)
	@CacheExpiration(15)
	@UseInterceptors(CacheInterceptor, UndefinedInterceptor)
	@UseFilters(new QueryFailedFilter())
	async addHashtag(@Body() HashtagData: CreateHashtagDto) {
		const newHashtag = Hashtags.create({
			tag_name: HashtagData.tag_name
		});
		const Hashtag = await this.HashtagService.createHashtag(newHashtag);
		return Hashtag ? { Hashtag } : Hashtag;
	}

	// method to update it by id
	@Put('update/:id')
	@UsePipes(ValidationPipe)
	@CacheExpiration(15)
	@UseInterceptors(CacheInterceptor, UndefinedInterceptor)
	@UseFilters(new QueryFailedFilter())
	async updateHashtag(@Param('id') HashtagId: number, @Body() HashtagData: UpdateHashtagDto) {
		const Hashtag = await this.HashtagService.updateHashtag(HashtagId, HashtagData);
		return Hashtag ? { Hashtag } : Hashtag;
	}

	// method to delete it by id
	@Delete('delete/:id')
	@CacheExpiration(15)
	@UseInterceptors(CacheInterceptor, UndefinedInterceptor)
	@UseFilters(new QueryFailedFilter())
	async deleteHashtag(@Param('id') HashtagId: number) {
		const message = await this.HashtagService.deleteHashtag(HashtagId);
		return message;
	}
}
