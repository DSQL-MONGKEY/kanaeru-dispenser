import { notFound } from 'next/navigation';
import { getClimberById } from '../api/get-climber-by-id';
import MixManualForm from './mix-manual-form';

type TDeviceViewPageProps = {
  mixManualId: string;
};

export default async function MixManualViewPage({
  mixManualId
}: TDeviceViewPageProps) {
  let mixManualData = null;
  let method = null;
  let pageTitle = 'Add New Device';

  if (mixManualId !== 'new') {
    const response = await getClimberById(mixManualId);

    const { data } =  response ? await response.json() : {
      data: null
    };

    pageTitle = 'Update';

    mixManualData = data;
    method = 'PUT';

    if(!data) {
      notFound();
    }
  }

  return <MixManualForm initialData={mixManualData} pageTitle={pageTitle} method={method} />;
}
