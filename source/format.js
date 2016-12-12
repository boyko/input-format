import template_formatter from './template formatter'

// Formats `value` value preserving `caret` at the same character.
//
// `{ value, caret }` attribute is the result of `parse()` function call.
//
// Returns `{ text, caret }` where the new `caret` is the caret position
// inside `text` text corresponding to the original `caret` position inside `value`.
//
// `formatter(value)` is a function returning `{ text, template }`.
//
// `text` is the `value` value formatted using `template`.
// It may either cut off the non-filled right part of the `template`
// or it may fill the non-filled character placeholders
// in the right part of the `template` with `spacer`
// which is a space (' ') character by default.
//
// `template` is the full-length template.
//
// `formatter` can also be a string — a `template`
// where character placeholders are denoted by 'x'es.
// In this case `formatter` function is automatically created.
//
// Example:
//
// `value` is '880',
// `caret` is `2` (before the first `0`)
//
// `formatter` is `'880' =>
//   { text: '8 (80 )', template: 'x (xxx) xxx-xx-xx' }`
//
// The result is `{ text: '8 (80 )', caret: 4 }`.
//
export default function format({ value, caret }, formatter) // , spacer = ' '
{
	if (typeof formatter === 'string')
	{
		formatter = template_formatter(formatter)
	}

	const { text, template } = formatter(value)

	let found = false
	let index = 0

	if (caret >= 0)
	{
		let possibly_last_input_character_index

		while (index < text.length)
		{
			// Character placeholder found
			if (text[index] !== template[index])
			{
				// // If this placeholder was left unfilled,
				// // then no more characters are filled-in.
				// if (text[index] === spacer)
				// {
				// 	break
				// }

				if (caret === 0)
				{
					found = true
					break
				}

				if (caret === 1)
				{
					possibly_last_input_character_index = index
				}

				caret--
			}

			index++
		}

		// If the caret was positioned after last input character,
		// then the text caret index is just after the last input character.
		if (!found)
		{
			index = possibly_last_input_character_index + 1
		}
	}

	const result =
	{
		text,
		caret : caret === undefined ? text.length : index
	}

	return result
}