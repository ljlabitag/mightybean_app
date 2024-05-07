

export default function SubmitButton({text, onClick, css}) {
    return(
        <button className={css} onClick={onClick}>{text}</button>
    )
}