import { redirect } from 'next/navigation';

export default function Login() {
  // Redirect to Clerk's sign-in page
  redirect('/sign-in');
}
