
import {Fragment} from 'react'


export default function BilibiliTextRender ({content}: {content: string}) {
    // TODO: @sy render bmoji
    // TODO: @sy render hashtags

    return (
        <>
            {(content || '').split('\n')
                .map(line => line.replace(/ /g, '\u00a0'))
                .map((line, index, lines) =>
                    index === lines.length - 1 ? line : <Fragment key={index}>{line}<br /></Fragment>
                )
            }
        </>
    )
}
