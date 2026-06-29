import { Metadata } from 'next';
import { productService } from '@/services/productService';
import ProductDetailsClient from './ProductDetailsClient';

// Dynamic SEO Metadata for Product Page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await productService.getProductById(id);
    return {
      title: `${product.title} - ReviewSphere`,
      description: product.shortDescription,
      openGraph: {
        title: `${product.title} - ReviewSphere`,
        description: product.shortDescription,
        images: [{ url: product.imageUrl }],
      },
    };
  } catch (error) {
    return {
      title: 'Product Details - ReviewSphere',
      description: 'View detailed product reviews and breakdowns.',
    };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <ProductDetailsClient productId={id} />;
}
