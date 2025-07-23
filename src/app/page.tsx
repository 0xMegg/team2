// import { supabase } from "../../utils/client";
// import { useEffect } from "react";
import MainPartComponent from "../components/main-part";
import MainTitleComponent from "../components/main-title";
import QuestionBoxComponent from "../components/question-box";

export default function Home() {
  // const getData = async () => {
  //   const { data: test } = await supabase.from("test").select("*");
  //   console.log(test);
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <div>
      <MainPartComponent>
        <MainTitleComponent />
        <QuestionBoxComponent />
      </MainPartComponent>
    </div>
  );
}
