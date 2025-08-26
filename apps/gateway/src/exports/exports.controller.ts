import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ExportsService } from './exports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/exports')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('request')
  async requestExport(@Body() body: any) {
    const { extension = 'json', meta = {} } = body || {};
    const { id, url } = await this.exportsService.createSignedUrl(extension, meta);
    await this.exportsService.audit({ id, extension, meta, url });
    return { id, url };
  }
}
