import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService.ts';

export class LikeController {
  private likeService: LikeService;

  constructor(
    likeService: LikeService = new LikeService()
  ) {
    this.likeService = likeService;
  }

  private handleError(res: Response, error: unknown) {
    if (
      error instanceof Error &&
      error.message === 'LIKE_ALREADY_EXISTS'
    ) {
      return res.status(409).json({
        status: 'fail',
        message: 'User sudah menyukai review ini',
      });
    }

    if (
      error instanceof Error &&
      error.message === 'LIKE_NOT_FOUND'
    ) {
      return res.status(404).json({
        status: 'fail',
        message: 'Like tidak ditemukan',
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : error,
    });
  }

  createLike = async (req: Request, res: Response) => {
    try {
      const data = await this.likeService.createLike(req.body);

      return res.status(201).json({
        status: 'success',
        message: 'Like berhasil ditambahkan',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteLike = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        await this.likeService.deleteLike(id);

        return res.status(200).json({
        status: 'success',
        message: 'Like berhasil dihapus',
        });
    } catch (error) {
        return this.handleError(res, error);
    }
    };
}