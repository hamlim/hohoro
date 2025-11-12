console.log("do nested files work too?");

export async function* generator(): AsyncGenerator<string> {
	yield "do nested files work too?";
}

// some change

export let bar = "baz";
