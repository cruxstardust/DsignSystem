import './style.css'
import { marked } from 'marked'
import {
  CircleCheck,
  CircleX,
  Copy,
  createIcons,
  Info,
  Mic,
  Paperclip,
  SendHorizontal,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
} from 'lucide'

type ButtonSize = 'small' | 'medium' | 'large'
type ButtonColor = 'primary' | 'secondary'
type AlertVariant = 'success' | 'info' | 'warning' | 'danger'
type IconName =
  | 'paperclip'
  | 'mic'
  | 'send-horizontal'
  | 'circle-check'
  | 'triangle-alert'
  | 'circle-x'
  | 'info'
  | 'copy'
  | 'thumbs-up'
  | 'thumbs-down'

function defineElement(name: string, ctor: CustomElementConstructor): void {
  if (!customElements.get(name)) {
    customElements.define(name, ctor)
  }
}

function iconTag(name: IconName, className: string): string {
  return `<i data-lucide="${name}" class="${className}" aria-hidden="true"></i>`
}

const lucideIcons = {
  CircleCheck,
  CircleX,
  Copy,
  Info,
  Mic,
  Paperclip,
  SendHorizontal,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
}

function hydrateIcons(root: Document | Element | DocumentFragment = document): void {
  createIcons({
    icons: lucideIcons,
    root,
    attrs: {
      'aria-hidden': 'true',
      focusable: 'false',
    },
  })
}

class DsButton extends HTMLElement {
  private buttonEl: HTMLButtonElement | null = null

  static get observedAttributes(): string[] {
    return ['size', 'color', 'outlined', 'disabled']
  }

  connectedCallback(): void {
    this.render()
  }

  attributeChangedCallback(): void {
    this.updateButton()
  }

  private render(): void {
    if (this.buttonEl) {
      this.updateButton()
      return
    }

    const button = document.createElement('button')
    button.type = 'button'

    const content = document.createElement('span')
    const children = Array.from(this.childNodes)
    children.forEach((node) => content.appendChild(node))
    button.appendChild(content)

    this.replaceChildren(button)
    this.style.display = 'block'
    this.style.width = '100%'

    this.buttonEl = button
    this.updateButton()
  }

  private updateButton(): void {
    if (!this.buttonEl) {
      return
    }

    const size = this.parseSize(this.getAttribute('size'))
    const color = this.parseColor(this.getAttribute('color'))
    const outlined = this.hasAttribute('outlined')
    const disabled = this.hasAttribute('disabled')

    this.buttonEl.className = this.buttonClassName(size, color, outlined)
    this.buttonEl.disabled = disabled
  }

  private parseSize(raw: string | null): ButtonSize {
    if (raw === 'small' || raw === 'medium' || raw === 'large') {
      return raw
    }
    return 'medium'
  }

  private parseColor(raw: string | null): ButtonColor {
    if (raw === 'primary' || raw === 'secondary') {
      return raw
    }
    return 'primary'
  }

  private buttonClassName(size: ButtonSize, color: ButtonColor, outlined: boolean): string {
    const base =
      'w-full rounded-[0.5rem] border font-semibold leading-tight transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none'

    const sizeClasses: Record<ButtonSize, string> = {
      small: 'px-5 py-3 text-sm',
      medium: 'px-6 py-4 text-base',
      large: 'px-7 py-[1.125rem] text-lg',
    }

    const colorClasses = outlined
      ? {
          primary: 'border-brand bg-transparent text-brand hover:bg-neutral-100',
          secondary: 'border-info-700 bg-transparent text-info-700 hover:bg-info-50',
        }
      : {
          primary: 'border-brand bg-brand text-neutral-0 hover:border-neutral-700 hover:bg-neutral-700',
          secondary:
            'border-info-700 bg-info-700 text-neutral-0 hover:border-info-500 hover:bg-info-500',
        }

    return `${base} ${sizeClasses[size]} ${colorClasses[color]}`
  }
}

defineElement('ds-button', DsButton)

class DsChatInput extends HTMLElement {
  private rendered = false

  connectedCallback(): void {
    if (this.rendered) {
      return
    }

    const placeholder = this.getAttribute('placeholder') ?? 'Message Dsign AI...'
    const textareaId = `ds-chat-input-${Math.random().toString(36).slice(2, 10)}`

    this.className = 'block w-full'
    this.innerHTML = `
      <div class="w-full rounded-2xl border border-neutral-300 border-r-neutral-400 bg-neutral-0 p-2.5 shadow-[0_8px_16px_-12px_rgb(17_24_39_/_14%)] transition-shadow duration-150 focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-neutral-50 motion-reduce:transition-none">
        <label class="sr-only" for="${textareaId}">Message</label>
        <textarea
          id="${textareaId}"
          rows="2"
          placeholder="${placeholder}"
          class="w-full resize-none border-0 bg-transparent p-1.5 text-base text-neutral-900 placeholder:text-neutral-700/70 focus:outline-none focus-visible:outline-none focus-visible:shadow-none"
        ></textarea>

        <div class="mt-1 flex items-center justify-between gap-3">
          <div class="flex items-center gap-1">
            <button
              type="button"
              aria-label="Attach file"
              class="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 transition-colors duration-150 hover:bg-neutral-100 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              ${iconTag('paperclip', 'h-4 w-4')}
            </button>

            <button
              type="button"
              aria-label="Voice input"
              class="inline-flex h-9 w-9 items-center justify-center rounded-md text-neutral-700 transition-colors duration-150 hover:bg-neutral-100 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              ${iconTag('mic', 'h-4 w-4')}
            </button>
          </div>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-[0.5rem] border border-brand bg-brand px-5 py-2.5 text-sm font-semibold text-neutral-0 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          >
            Send
            ${iconTag('send-horizontal', 'h-3.5 w-3.5')}
          </button>
        </div>
      </div>
    `

    hydrateIcons(this)
    this.rendered = true
  }
}

defineElement('ds-chat-input', DsChatInput)

class DsAlert extends HTMLElement {
  private rendered = false
  private rootEl: HTMLElement | null = null
  private iconEl: HTMLElement | null = null
  private titleEl: HTMLElement | null = null
  private messageEl: HTMLElement | null = null

  static get observedAttributes(): string[] {
    return ['variant', 'title']
  }

  connectedCallback(): void {
    if (!this.rendered) {
      this.render()
    }
    this.update()
  }

  attributeChangedCallback(): void {
    this.update()
  }

  private render(): void {
    const message = document.createElement('div')
    const children = Array.from(this.childNodes)
    children.forEach((node) => message.appendChild(node))

    const root = document.createElement('article')
    const icon = document.createElement('span')
    const content = document.createElement('div')
    const title = document.createElement('p')

    root.append(icon, content)
    content.append(title, message)

    this.className = 'block w-full'
    this.replaceChildren(root)

    this.rootEl = root
    this.iconEl = icon
    this.titleEl = title
    this.messageEl = message
    this.rendered = true
  }

  private update(): void {
    if (!this.rootEl || !this.iconEl || !this.titleEl || !this.messageEl) {
      return
    }

    const variant = this.parseVariant(this.getAttribute('variant'))
    const config = this.variantConfig(variant)
    const title = this.getAttribute('title') ?? config.defaultTitle

    this.setAttribute('role', variant === 'danger' || variant === 'warning' ? 'alert' : 'status')
    this.setAttribute('aria-live', variant === 'danger' || variant === 'warning' ? 'assertive' : 'polite')

    this.rootEl.className =
      `grid grid-cols-[auto_1fr] gap-3 rounded-xl border p-4 shadow-[0_10px_20px_-20px_rgb(30_30_30_/_35%)] ${config.surface}`

    this.iconEl.className =
      `mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full border ${config.icon}`
    this.iconEl.innerHTML = iconTag(config.iconName, 'h-4 w-4')
    hydrateIcons(this.iconEl)

    this.titleEl.className = `m-0 text-sm font-semibold ${config.title}`
    this.titleEl.textContent = title

    this.messageEl.className = 'mt-1 text-sm leading-6 text-neutral-900 [&_p:last-child]:mb-0'
  }

  private parseVariant(raw: string | null): AlertVariant {
    if (raw === 'success' || raw === 'info' || raw === 'warning' || raw === 'danger') {
      return raw
    }
    return 'info'
  }

  private variantConfig(variant: AlertVariant): {
    defaultTitle: string
    surface: string
    icon: string
    title: string
    iconName: IconName
  } {
    switch (variant) {
      case 'success':
        return {
          defaultTitle: 'Success',
          surface: 'border-success-400 bg-success-50',
          icon: 'border-success-400/45 bg-success-50 text-success-700',
          title: 'text-success-700',
          iconName: 'circle-check',
        }
      case 'warning':
        return {
          defaultTitle: 'Warning',
          surface: 'border-warning-400 bg-warning-50',
          icon: 'border-warning-400/45 bg-warning-50 text-warning-700',
          title: 'text-warning-700',
          iconName: 'triangle-alert',
        }
      case 'danger':
        return {
          defaultTitle: 'Danger',
          surface: 'border-danger-400 bg-danger-50',
          icon: 'border-danger-400/45 bg-danger-50 text-danger-700',
          title: 'text-danger-700',
          iconName: 'circle-x',
        }
      case 'info':
      default:
        return {
          defaultTitle: 'Info',
          surface: 'border-info-400 bg-info-50',
          icon: 'border-info-400/45 bg-info-50 text-info-700',
          title: 'text-info-700',
          iconName: 'info',
        }
    }
  }
}

defineElement('ds-alert', DsAlert)

function messageActionButton(iconName: IconName, label: string, tone: 'neutral' | 'info' = 'neutral'): string {
  const toneHover = tone === 'info' ? 'hover:bg-info-100' : 'hover:bg-neutral-100'

  return `
    <button
      type="button"
      aria-label="${label}"
      class="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-700 transition-colors duration-150 ${toneHover} hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
    >
      ${iconTag(iconName, 'h-3.5 w-3.5')}
    </button>
  `
}

function normalizeMarkdownSource(source: string): string {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  while (lines.length && lines[0].trim() === '') lines.shift()
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop()

  const indents = lines
    .filter((line) => line.trim() !== '')
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0)
  const minIndent = indents.length ? Math.min(...indents) : 0

  return lines.map((line) => line.slice(minIndent)).join('\n')
}

class DsHumanMessage extends HTMLElement {
  private rendered = false
  private authorEl: HTMLElement | null = null
  private timeEl: HTMLElement | null = null

  static get observedAttributes(): string[] {
    return ['author', 'timestamp']
  }

  connectedCallback(): void {
    if (!this.rendered) {
      this.render()
    }
    this.update()
  }

  attributeChangedCallback(): void {
    this.update()
  }

  private render(): void {
    const message = document.createElement('div')
    const children = Array.from(this.childNodes)
    children.forEach((node) => message.appendChild(node))

    const article = document.createElement('article')
    article.className =
      'w-full max-w-4xl rounded-xl border border-info-200 bg-info-50 px-5 py-3 shadow-[0_8px_16px_-14px_rgb(17_24_39_/_10%)] md:px-6 md:py-4'

    const meta = document.createElement('div')
    meta.className = 'mb-2 flex items-center gap-2 text-xs leading-5 text-neutral-600'
    const author = document.createElement('span')
    author.className = 'font-semibold text-info-700'
    const time = document.createElement('time')
    time.className = 'text-neutral-600'
    meta.append(author, time)

    message.className = 'text-sm leading-7 text-neutral-900'

    const actions = document.createElement('div')
    actions.className = 'mt-1 flex items-center gap-1'
    actions.innerHTML = [
      messageActionButton('copy', 'Copy message', 'info'),
      messageActionButton('thumbs-up', 'Like message', 'info'),
      messageActionButton('thumbs-down', 'Dislike message', 'info'),
    ].join('')

    article.append(meta, message, actions)
    this.className = 'block w-full'
    this.replaceChildren(article)

    this.authorEl = author
    this.timeEl = time
    this.rendered = true
    hydrateIcons(article)
  }

  private update(): void {
    if (!this.authorEl || !this.timeEl) {
      return
    }
    this.authorEl.textContent = this.getAttribute('author') ?? 'You'
    this.timeEl.textContent = this.getAttribute('timestamp') ?? ''
  }
}

defineElement('ds-human-message', DsHumanMessage)

class DsBotMessage extends HTMLElement {
  private rendered = false
  private authorEl: HTMLElement | null = null
  private timeEl: HTMLElement | null = null
  private markdownSource = ''

  static get observedAttributes(): string[] {
    return ['author', 'timestamp']
  }

  connectedCallback(): void {
    if (!this.rendered) {
      this.render()
    }
    this.update()
  }

  attributeChangedCallback(): void {
    this.update()
  }

  private render(): void {
    this.markdownSource = normalizeMarkdownSource(this.textContent ?? '')
    const message = document.createElement('div')

    const article = document.createElement('article')
    article.className =
      'w-full max-w-4xl rounded-xl border border-neutral-300 bg-neutral-0 px-5 py-3 shadow-[0_8px_16px_-14px_rgb(17_24_39_/_10%)] md:px-6 md:py-4'

    const meta = document.createElement('div')
    meta.className = 'mb-2 flex items-center gap-2 text-xs leading-5 text-neutral-600'
    const author = document.createElement('span')
    author.className = 'font-semibold text-neutral-700'
    const time = document.createElement('time')
    time.className = 'text-neutral-600'
    meta.append(author, time)

    message.className = 'ds-markdown'
    message.innerHTML = marked.parse(this.markdownSource, {
      gfm: true,
      breaks: true,
    }) as string

    const actions = document.createElement('div')
    actions.className = 'mt-1 flex items-center gap-1'
    actions.innerHTML = [
      messageActionButton('copy', 'Copy message'),
      messageActionButton('thumbs-up', 'Like message'),
      messageActionButton('thumbs-down', 'Dislike message'),
    ].join('')

    article.append(meta, message, actions)
    this.className = 'block w-full'
    this.replaceChildren(article)

    this.authorEl = author
    this.timeEl = time
    this.rendered = true
    hydrateIcons(article)
  }

  private update(): void {
    if (!this.authorEl || !this.timeEl) {
      return
    }
    this.authorEl.textContent = this.getAttribute('author') ?? 'Assistant'
    this.timeEl.textContent = this.getAttribute('timestamp') ?? ''
  }
}

defineElement('ds-bot-message', DsBotMessage)
