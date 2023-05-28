import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
	async create(file: Express.Multer.File) {
		return file;
	}
}
