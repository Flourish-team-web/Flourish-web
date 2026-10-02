import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'flourish-woman/general';
    const resourceType = (formData.get('resourceType') as string) || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Strict Size Validation
    const MAX_VIDEO_SIZE = 3 * 1024 * 1024; // 3 MB strictly enforced
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB for images

    if (resourceType === 'video' || file.type.startsWith('video/')) {
      if (file.size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          { error: 'Video file size exceeds maximum limit of 3 MB.' },
          { status: 400 }
        );
      }
    } else {
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Image file size exceeds maximum limit of 10 MB.' },
          { status: 400 }
        );
      }
    }

    // 2. Strict MIME Type Validation
    const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
    const allowedVideoMimes = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (resourceType === 'video') {
      if (!allowedVideoMimes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid video format. Supported formats: MP4, WebM, MOV.' },
          { status: 400 }
        );
      }
    } else {
      if (!allowedImageMimes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid image format. Supported formats: JPG, PNG, WEBP, AVIF, SVG.' },
          { status: 400 }
        );
      }
    }

    // If Cloudinary credentials are not configured in dev, provide graceful development placeholder URL
    if (!cloudName || !apiKey || !apiSecret || cloudName.includes('your_cloud_name')) {
      const isVideo = resourceType === 'video' || file.type.startsWith('video/');
      const mockUrl = isVideo
        ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop';

      return NextResponse.json({
        url: mockUrl,
        public_id: `dev_${Date.now()}`,
        format: file.type.split('/')[1] || 'webp',
        resource_type: isVideo ? 'video' : 'image',
        bytes: file.size,
        message: 'Dev placeholder used because Cloudinary credentials are pending in .env',
      });
    }

    // 3. Prepare Cloudinary Signed Upload
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('api_key', apiKey);
    cloudinaryFormData.append('timestamp', timestamp.toString());
    cloudinaryFormData.append('signature', signature);
    cloudinaryFormData.append('folder', folder);

    const actualResourceType = resourceType === 'video' ? 'video' : 'image';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${actualResourceType}/upload`;

    const cloudinaryRes = await fetch(uploadUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    const result = await cloudinaryRes.json();

    if (!cloudinaryRes.ok || result.error) {
      console.error('Cloudinary API upload error:', result.error);
      return NextResponse.json(
        { error: result.error?.message || 'Failed to upload media to Cloudinary' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: result.secure_url || result.url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error('Upload route error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred during media upload.' },
      { status: 500 }
    );
  }
}
