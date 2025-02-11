import { useEffect } from "react";
import MainLayout from "./views/MainLayout";
import setAppBarTitle from "./views/util/set_title";

export default function App() {
  useEffect(() => setAppBarTitle('KeuanganKu 1.0'), []);
  return (
    <MainLayout/>
  );
}