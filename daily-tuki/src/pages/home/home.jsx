import { useEffect } from "react";
import { useTasks } from "./hooks/useTasks";

export function Home() {
  const { tasks } = useTasks();

  useEffect(() => { //solo muestro en consola las tasks para ver que funciona
    console.log("tasks:", tasks);
  }, [tasks]);

  return (
    <div>
      <h1>Daily Tuki</h1>
      <p>Abrí la consola</p>
    </div>
  );
}
