import { redirect } from "next/navigation";


export default function Page() {
  
  redirect("/dashboard/alerts");
  return <>Dashboard page</>;
}
