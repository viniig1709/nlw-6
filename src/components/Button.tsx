import { useState } from "react";

type ButtonProps = {
	text?: string; // ? significa opcional
	children?: string;
}

export function Button(props: ButtonProps) {

	// let counter = 0;
	const [counter, setCounter] = useState(0)

	const increment = () => { // function increment() {}
		// counter += 1;
		setCounter(counter + 1);
	}

	return (
		<button onClick={increment}>
			Clique aqui! {props.text || ''} {props.children} {counter}
		</button>
	)
}