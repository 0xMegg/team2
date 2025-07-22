import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export default async function TestPage() {
  const supabase = await createClient();
  const { data: test } = await supabase.from("test").select("*");
  console.log("test", test);

  return (
    <>
      <div>
        TestPage
        <div>
          <Image src="/img/test.png" alt="test" width={100} height={100} />
        </div>
      </div>
    </>
  );
}
