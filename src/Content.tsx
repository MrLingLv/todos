import { useRecoilState } from "recoil";
import { textChange } from "./atom";

export function Content() {
    const [text, setText] = useRecoilState(textChange)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const value = e.currentTarget.value.trim()
        setText(value)
    }

  return (
    <>
      <div>
        <input type="text" onChange={onChange} placeholder="content"/>
        <p>content: {text}</p>
      </div>
    </>
  );
}
