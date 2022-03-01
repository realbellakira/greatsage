
interface IProps {
    href: string
    children: React.ReactNode
}

export default function OpenInNewTab ({href, children}: IProps) {
    const openInNewTab = () => {
        window.open(href, '_blank')
    }

    return (
        <div role="link" data-href={href} onClick={openInNewTab}>{children}</div>
    )
}
