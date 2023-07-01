
import bilibiliNumberFormat from 'src/libs/bilibilinumberformat'

import {IProps} from './SageSpecs'
import BilibiliTextRender from '../BilibiliTextRender'
import OpenInNewTab from '../OpenInNewTab'
import {formatOriginSageAction} from 'src/libs/sageformat'


export default function SageCardContent ({sage}: IProps) {
    return (
        <div className="card-content">
            {sage.type === 'repost' && (<SageCardTextDescription content={sage.content.content} />)}
            <div className={`post-content${sage.type === 'repost' ? ' repost' : ''}`}>
                <div className="original-card-content">
                    <SageCardOriginalCardContent sage={sage} />
                </div>
            </div>
        </div>
    )
}

function SageCardOriginalCardContent ({sage}: IProps) {
    if (sage.type === 'text') return <SageCardTextDescription content={sage.content.content} />
    if (sage.type === 'image') return <SageCardOriginalImageCardContent sage={sage} />
    if (sage.type === 'video') return <SageCardOriginalVideoCardContent sage={sage} />
    if (sage.type === 'article') return <SageCardOriginalArticleCardContent sage={sage} />
    if (sage.type === 'audio') return <SageCardOriginalAudioCardContent sage={sage} />

    if (sage.type === 'repost') return <SageCardOriginalRepostCardContent sage={sage} />

    // return <pre>{JSON.stringify(sage.content, undefined, 2)}</pre>

    return null
}

function SageCardTextDescription ({content}: {content: string}) {
    return (
        <div className="text description">
            <div className="content">
                <div className="content-full">
                    <BilibiliTextRender content={content} />
                </div>
            </div>
        </div>
    )
}

function SageCardOriginalVideoCardContent ({sage}: IProps) {
    if (sage.type !== 'video') return null

    return (
        <>
            {!!sage.content.dynamic && <SageCardTextDescription content={sage.content.dynamic} />}
            <div className="video-container can-hover">
                <a href={sage.content.url} target="_blank">
                    <div className="video-wrap">
                        <div className="image-area">
                            <img src={sage.content.picture} alt="" />
                        </div>
                        <div className="text-area">
                            <div className="title">{sage.content.title}</div>
                            <div className="content">{sage.content.description}</div>
                            <div className="view-danmaku">
                                <div>
                                    <i className="bp-icon-font icon-play-a" />
                                    <span className="view">{bilibiliNumberFormat(sage.content.stats?.view)}</span>
                                </div>
                                <div>
                                    <i className="bp-icon-font icon-danmu-a" />
                                    <span className="danmaku">{bilibiliNumberFormat(sage.content.stats?.danmaku)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </>
    )
}

function SageCardOriginalArticleCardContent ({sage}: IProps) {
    if (sage.type !== 'article') return null

    return (
        <div className="article-container">
            <a href={sage.content.url} target="_blank">
                <div>
                    {/* // TODO: @sy render multiple pictures */}
                    <div className="images-area">
                        <img src={sage.content.pictures[0]} className="card-1" />
                    </div>
                </div>
                <div className="text-area">
                    <div className="title">{sage.content.title}</div>
                    <div className="content">
                        {sage.content.content}
                    </div>
                </div>
            </a>
        </div>
    )
}

function SageCardOriginalAudioCardContent ({sage}: IProps) {
    if (sage.type !== 'audio') return null

    return (
        <>
            <SageCardTextDescription content={sage.content.dynamic} />
            <div className="audio-container can-hover">
                <a href={'https://www.bilibili.com/audio/au' + sage.originSage?.card?.id} target="_blank">
                    <div className="audio-wrap">
                        <div className="image-area">
                            <img src={sage.content.picture} alt="" />
                        </div>
                        <div className="text-area">
                            <div className="title">{sage.content.title}</div>
                            <div className="content">{sage.content.description}</div>
                        </div>
                    </div>
                </a>
            </div>
        </>
    )
}

function SageCardOriginalImageCardContent ({sage}: IProps) {
    // TODO: @sy image size adjust
    // TODO: @sy image zoom
    if (sage.type !== 'image') return null

    return (
        <>
            <SageCardTextDescription content={sage.content.content} />
            <div className="imagesbox">
                <div className="zoom-wrap">
                    <ul className={`zoom-list zoom-${sage.content.pictures.length}`}>
                        {sage.content.pictures.map(picture => (
                            <li className="card" key={picture}>
                                <div className="img-content">
                                    <img src={`${picture}@480w_480h_1e_1c.webp`} alt="" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

function SageCardOriginalRepostCardContent ({sage}: IProps) {
    if (sage.type !== 'repost') return null

    return (
        <>
            <div className="up-info">
                <a className="up-info-avatar" href={sage.originSage.user.url} target="_blank">
                    <img className="bili-avatar-img bili-avatar-face bili-avatar-img-radius" src={sage.originSage.user.avatar} />
                </a>
                <a className="username up-info-name" href={sage.originSage.user.url} target="_blank">
                    {sage.originSage.user.name}
                </a>
                <span className="up-info-tip">{formatOriginSageAction(sage)}</span>
            </div>
            <OpenInNewTab href={sage.originSage.url}>
                <SageCardOriginalRepostedCardContent sage={sage.originSage} />
            </OpenInNewTab>
        </>
    )
}

function SageCardOriginalRepostedCardContent ({sage}: IProps) {
    // TODO: @sy render originSage
    if (sage.type === 'text') return <SageCardTextDescription content={sage.content.content} />
    if (sage.type === 'image') return <SageCardOriginalImageCardContent sage={sage} />
    if (sage.type === 'video') return <SageCardOriginalVideoCardContent sage={sage} />

    return <pre>{JSON.stringify(sage, undefined, 2)}</pre>
}
