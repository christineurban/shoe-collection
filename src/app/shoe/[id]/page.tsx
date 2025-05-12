import { ShoeDetails } from '@/components/ShoeDetails';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { getShoeById } from '@/lib/api/shoe';
import { Shoe } from '@/types/shoe';
import { PageHeader } from '@/components/PageHeader';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ShoePage({ params }: PageProps) {
  try {
    const data = await getShoeById(params.id);
    const shoe: Shoe = {
      id: data.id,
      brand: data.brand.name,
      name: data.brand.name,
      imageUrl: data.image_url,
      colors: data.colors.map(c => c.color.name),
      dressStyle: data.dress_style.name,
      shoeType: data.shoe_type.name,
      heelType: data.heel_type.name,
      location: data.location.name,
      notes: data.notes,
    };

    return (
      <SuspenseBoundary>
        <ShoeDetails
          shoe={shoe}
          title={`${shoe.brand} ${shoe.heelType} ${shoe.shoeType}`}
        />
      </SuspenseBoundary>
    );
  } catch (error) {
    return (
      <PageHeader
        title="Error"
        description={error instanceof Error ? error.message : 'An error occurred'}
      />
    );
  }
}
