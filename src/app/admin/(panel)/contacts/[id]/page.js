import ContactDetail from './ContactDetail';

export const metadata = { title: 'Contact Detail – Admin' };

export default function AdminContactDetailPage({ params }) {
  return <ContactDetail params={params} />;
}
