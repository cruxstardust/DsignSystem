import './style.css'
import { marked } from 'marked'
import embed from 'vega-embed'
import {
  ChartArea,
  CircleCheck,
  CircleStop,
  CircleX,
  Copy,
  createIcons,
  Expand,
  Info,
  Mic,
  Paperclip,
  Printer,
  SendHorizontal,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
  X,
} from 'lucide'

type ButtonSize = 'small' | 'medium' | 'large'
type ButtonColor = 'primary' | 'secondary'
type AlertVariant = 'success' | 'info' | 'warning' | 'danger'
type IconName =
  | 'paperclip'
  | 'mic'
  | 'send-horizontal'
  | 'circle-check'
  | 'circle-stop'
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
  ChartArea,
  CircleCheck,
  CircleStop,
  CircleX,
  Copy,
  Expand,
  Info,
  Mic,
  Paperclip,
  Printer,
  SendHorizontal,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
  X,
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

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-[0.5rem] border border-danger-300 bg-danger-50 px-3.5 py-2.5 text-sm font-semibold text-danger-700 transition-colors duration-150 hover:border-danger-400 hover:bg-danger-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              ${iconTag('circle-stop', 'h-3.5 w-3.5')}
              Stop Generation
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-[0.5rem] border border-brand bg-brand px-5 py-2.5 text-sm font-semibold text-neutral-0 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              Send
              ${iconTag('send-horizontal', 'h-3.5 w-3.5')}
            </button>
          </div>
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

const HITL_DATE_ATTRIBUTE_OPTIONS = ['RDD Date', 'SO Date', 'POD Date'] as const
type HitlDateAttribute = (typeof HITL_DATE_ATTRIBUTE_OPTIONS)[number]

function parseCsvItems(raw: string | null): string[] {
  if (!raw) {
    return []
  }
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
}

class DsSingleSelect extends HTMLElement {
  private readonly baseId = `ds-single-select-${Math.random().toString(36).slice(2, 10)}`
  private options: string[] = []
  private currentValue = ''
  private isOpen = false
  private removeDocumentMouseDownListener: (() => void) | null = null
  private removeDocumentKeydownListener: (() => void) | null = null
  private typeaheadBuffer = ''
  private typeaheadTimeout: number | null = null
  private pendingFocusValue: string | null = null

  static get observedAttributes(): string[] {
    return ['options', 'value', 'placeholder', 'name', 'aria-label', 'disabled']
  }

  connectedCallback(): void {
    this.syncStateFromAttributes()
    this.render()
  }

  disconnectedCallback(): void {
    this.cleanupGlobalListeners()
    this.clearTypeahead()
  }

  attributeChangedCallback(): void {
    this.syncStateFromAttributes()
    this.render()
  }

  private syncStateFromAttributes(): void {
    this.options = parseCsvItems(this.getAttribute('options'))
    const incoming = this.getAttribute('value')?.trim() ?? ''

    if (incoming && this.options.includes(incoming)) {
      this.currentValue = incoming
      return
    }

    if (!this.options.includes(this.currentValue)) {
      this.currentValue = this.options[0] ?? ''
    }
  }

  private triggerLabel(): string {
    const placeholder = this.getAttribute('placeholder')
    return this.currentValue || placeholder || 'Select'
  }

  private buildOptionButtons(): string {
    return this.options
      .map((option) => {
        const selected = option === this.currentValue
        return `
          <button
            type="button"
            role="option"
            aria-selected="${selected}"
            data-single-option="${option}"
            class="flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus motion-reduce:transition-none ${
              selected
                ? 'bg-info-50 text-info-700'
                : 'text-neutral-900 hover:bg-neutral-100'
            }"
          >
            <span class="font-medium">${option}</span>
          </button>
        `
      })
      .join('')
  }

  private emitChange(): void {
    this.dispatchEvent(
      new CustomEvent('ds-single-select-change', {
        detail: { value: this.currentValue },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private clearTypeahead(): void {
    if (this.typeaheadTimeout != null) {
      window.clearTimeout(this.typeaheadTimeout)
      this.typeaheadTimeout = null
    }
    this.typeaheadBuffer = ''
  }

  private optionElements(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>('[data-single-option]'))
  }

  private focusOptionByValue(value: string | null, fallback: 'first' | 'last' = 'first'): void {
    const options = this.optionElements()
    if (options.length === 0) {
      return
    }

    const selected = value ? options.find((option) => option.dataset.singleOption === value) : null
    const target = selected ?? (fallback === 'last' ? options[options.length - 1] : options[0])
    target?.focus()
  }

  private openMenu(focusTarget: 'selected' | 'first' | 'last' = 'selected'): void {
    if (this.hasAttribute('disabled')) {
      return
    }
    this.isOpen = true
    this.pendingFocusValue = focusTarget === 'selected' ? this.currentValue : null
    this.render()
    requestAnimationFrame(() => {
      if (focusTarget === 'last' && !this.pendingFocusValue) {
        this.focusOptionByValue(null, 'last')
      } else {
        this.focusOptionByValue(this.pendingFocusValue, 'first')
      }
      this.pendingFocusValue = null
    })
  }

  private closeMenu(focusTrigger = false): void {
    if (!this.isOpen) {
      return
    }
    this.isOpen = false
    this.pendingFocusValue = null
    this.clearTypeahead()
    this.render()
    if (focusTrigger) {
      requestAnimationFrame(() => {
        const trigger = this.querySelector<HTMLButtonElement>(`#${this.baseId}-trigger`)
        trigger?.focus()
      })
    }
  }

  private selectValue(value: string): void {
    if (!this.options.includes(value)) {
      return
    }
    this.currentValue = value
    this.emitChange()
    this.closeMenu(true)
  }

  private moveFocus(currentIndex: number, delta: number): void {
    const options = this.optionElements()
    if (options.length === 0) {
      return
    }
    const nextIndex = Math.max(0, Math.min(options.length - 1, currentIndex + delta))
    options[nextIndex]?.focus()
  }

  private focusByPrefix(prefix: string, fromIndex: number): void {
    const options = this.optionElements()
    if (options.length === 0) {
      return
    }
    const normalized = prefix.toLowerCase()
    for (let step = 1; step <= options.length; step += 1) {
      const idx = (fromIndex + step) % options.length
      const value = (options[idx]?.dataset.singleOption ?? '').toLowerCase()
      if (value.startsWith(normalized)) {
        options[idx]?.focus()
        return
      }
    }
  }

  private cleanupGlobalListeners(): void {
    this.removeDocumentMouseDownListener?.()
    this.removeDocumentKeydownListener?.()
    this.removeDocumentMouseDownListener = null
    this.removeDocumentKeydownListener = null
  }

  private handleMenuKeydown(event: KeyboardEvent): void {
    const options = this.optionElements()
    if (options.length === 0) {
      return
    }

    const activeElement = document.activeElement as HTMLElement | null
    const currentIndex = options.findIndex((option) => option === activeElement)
    const safeIndex = currentIndex >= 0 ? currentIndex : 0

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.moveFocus(safeIndex, 1)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.moveFocus(safeIndex, -1)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      options[0]?.focus()
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      options[options.length - 1]?.focus()
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const value = options[safeIndex]?.dataset.singleOption
      if (value) {
        this.selectValue(value)
      }
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      this.closeMenu(true)
      return
    }
    if (event.key === 'Tab') {
      this.closeMenu(false)
      return
    }
    if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1) {
      this.typeaheadBuffer += event.key.toLowerCase()
      this.focusByPrefix(this.typeaheadBuffer, safeIndex)
      if (this.typeaheadTimeout != null) {
        window.clearTimeout(this.typeaheadTimeout)
      }
      this.typeaheadTimeout = window.setTimeout(() => {
        this.typeaheadBuffer = ''
        this.typeaheadTimeout = null
      }, 500)
    }
  }

  private attachEventHandlers(): void {
    const disabled = this.hasAttribute('disabled')
    const trigger = this.querySelector<HTMLButtonElement>(`#${this.baseId}-trigger`)
    trigger?.addEventListener('click', () => {
      if (disabled) {
        return
      }
      if (this.isOpen) {
        this.closeMenu(false)
      } else {
        this.openMenu('selected')
      }
    })

    trigger?.addEventListener('keydown', (event) => {
      if (disabled) {
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        this.openMenu('selected')
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        this.openMenu('last')
        return
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.openMenu('selected')
      }
    })

    this.cleanupGlobalListeners()

    const menu = this.querySelector<HTMLElement>(`#${this.baseId}-menu`)
    menu?.addEventListener('keydown', (event) => {
      this.handleMenuKeydown(event)
    })
    menu?.addEventListener('click', (event) => {
      const target = event.target
      if (!(target instanceof Element)) {
        return
      }
      const option = target.closest<HTMLElement>('[data-single-option]')
      const value = option?.dataset.singleOption
      if (value) {
        this.selectValue(value)
      }
    })

    const handleMouseDown = (event: MouseEvent): void => {
      if (!this.isOpen) {
        return
      }
      const target = event.target
      if (target instanceof Node && this.contains(target)) {
        return
      }
      this.closeMenu(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    this.removeDocumentMouseDownListener = () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeMenu(true)
      }
    }
    document.addEventListener('keydown', handleKeydown)
    this.removeDocumentKeydownListener = () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }

  private render(): void {
    const nameAttr = this.getAttribute('name')
    const ariaLabel = this.getAttribute('aria-label') ?? 'Select'
    const disabled = this.hasAttribute('disabled')
    const disabledAttr = disabled ? 'disabled' : ''

    this.className = 'block w-full'
    this.innerHTML = `
      <div class="relative">
        ${
          nameAttr
            ? `<input type="hidden" name="${nameAttr}" value="${this.currentValue}" />`
            : ''
        }
        <button
          id="${this.baseId}-trigger"
          type="button"
          aria-label="${ariaLabel}"
          aria-haspopup="listbox"
          aria-expanded="${this.isOpen}"
          ${disabledAttr}
          class="flex w-full items-center justify-between rounded-lg border border-neutral-300 bg-neutral-0 px-3 py-2 text-left text-sm text-neutral-900 transition-colors duration-150 hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
        >
          <span class="truncate">${this.triggerLabel()}</span>
          <span class="ml-2 text-xs text-neutral-700">${this.isOpen ? '▴' : '▾'}</span>
        </button>

        ${
          this.isOpen
            ? `
          <div
            id="${this.baseId}-menu"
            role="listbox"
            aria-label="${ariaLabel}"
            class="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-neutral-300 bg-neutral-0 p-1 shadow-[0_12px_24px_-16px_rgb(17_24_39_/_35%)]"
          >
            ${this.buildOptionButtons()}
          </div>
        `
            : ''
        }
      </div>
    `

    this.attachEventHandlers()
  }
}

defineElement('ds-single-select', DsSingleSelect)

class DsMultiSelect extends HTMLElement {
  private readonly baseId = `ds-multi-select-${Math.random().toString(36).slice(2, 10)}`
  private options: string[] = []
  private selectedValues = new Set<string>()
  private isOpen = false
  private removeDocumentMouseDownListener: (() => void) | null = null
  private removeDocumentKeydownListener: (() => void) | null = null
  private typeaheadBuffer = ''
  private typeaheadTimeout: number | null = null
  private pendingFocusValue: string | null = null

  static get observedAttributes(): string[] {
    return ['options', 'selected', 'placeholder', 'aria-label', 'disabled', 'min-selected']
  }

  connectedCallback(): void {
    this.syncStateFromAttributes()
    this.render()
  }

  disconnectedCallback(): void {
    this.cleanupGlobalListeners()
    this.clearTypeahead()
  }

  attributeChangedCallback(): void {
    this.syncStateFromAttributes()
    this.render()
  }

  private minSelected(): number {
    const parsed = Number(this.getAttribute('min-selected') ?? '0')
    if (!Number.isFinite(parsed) || parsed < 0) {
      return 0
    }
    return Math.floor(parsed)
  }

  private syncStateFromAttributes(): void {
    this.options = parseCsvItems(this.getAttribute('options'))
    const selectedFromAttr = new Set(
      parseCsvItems(this.getAttribute('selected')).filter((value) => this.options.includes(value)),
    )

    if (selectedFromAttr.size > 0) {
      this.selectedValues = selectedFromAttr
    } else {
      this.selectedValues = new Set(
        Array.from(this.selectedValues).filter((value) => this.options.includes(value)),
      )
    }

    const minSelected = this.minSelected()
    if (this.selectedValues.size < minSelected) {
      for (const option of this.options) {
        this.selectedValues.add(option)
        if (this.selectedValues.size >= minSelected) {
          break
        }
      }
    }
  }

  private triggerLabel(): string {
    const placeholder = this.getAttribute('placeholder') ?? 'Select options'
    const count = this.selectedValues.size
    if (count === 0) {
      return placeholder
    }
    if (count === 1) {
      return Array.from(this.selectedValues)[0] ?? placeholder
    }
    return `${count} selected`
  }

  private emitChange(): void {
    this.dispatchEvent(
      new CustomEvent('ds-multi-select-change', {
        detail: { selected: Array.from(this.selectedValues) },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private clearTypeahead(): void {
    if (this.typeaheadTimeout != null) {
      window.clearTimeout(this.typeaheadTimeout)
      this.typeaheadTimeout = null
    }
    this.typeaheadBuffer = ''
  }

  private optionElements(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>('[data-multi-option]'))
  }

  private focusOptionByValue(value: string | null, fallback: 'first' | 'last' = 'first'): void {
    const options = this.optionElements()
    if (options.length === 0) {
      return
    }
    const selected = value ? options.find((option) => option.dataset.multiOption === value) : null
    const target = selected ?? (fallback === 'last' ? options[options.length - 1] : options[0])
    target?.focus()
  }

  private openMenu(focusTarget: 'selected' | 'first' | 'last' = 'selected'): void {
    if (this.hasAttribute('disabled')) {
      return
    }
    this.isOpen = true
    this.pendingFocusValue =
      focusTarget === 'selected' ? Array.from(this.selectedValues)[0] ?? null : null
    this.render()
    requestAnimationFrame(() => {
      if (focusTarget === 'last' && !this.pendingFocusValue) {
        this.focusOptionByValue(null, 'last')
      } else {
        this.focusOptionByValue(this.pendingFocusValue, 'first')
      }
      this.pendingFocusValue = null
    })
  }

  private closeMenu(focusTrigger = false): void {
    if (!this.isOpen) {
      return
    }
    this.isOpen = false
    this.pendingFocusValue = null
    this.clearTypeahead()
    this.render()
    if (focusTrigger) {
      requestAnimationFrame(() => {
        const trigger = this.querySelector<HTMLButtonElement>(`#${this.baseId}-trigger`)
        trigger?.focus()
      })
    }
  }

  private cleanupGlobalListeners(): void {
    this.removeDocumentMouseDownListener?.()
    this.removeDocumentKeydownListener?.()
    this.removeDocumentMouseDownListener = null
    this.removeDocumentKeydownListener = null
  }

  private toggleOption(value: string): void {
    if (!this.options.includes(value)) {
      return
    }

    const minSelected = this.minSelected()
    if (this.selectedValues.has(value)) {
      if (this.selectedValues.size <= minSelected) {
        return
      }
      this.selectedValues.delete(value)
      return
    }

    this.selectedValues.add(value)
  }

  private moveFocus(currentIndex: number, delta: number): void {
    const options = this.optionElements()
    if (options.length === 0) {
      return
    }
    const nextIndex = Math.max(0, Math.min(options.length - 1, currentIndex + delta))
    options[nextIndex]?.focus()
  }

  private focusByPrefix(prefix: string, fromIndex: number): void {
    const options = this.optionElements()
    if (options.length === 0) {
      return
    }
    const normalized = prefix.toLowerCase()
    for (let step = 1; step <= options.length; step += 1) {
      const idx = (fromIndex + step) % options.length
      const value = (options[idx]?.dataset.multiOption ?? '').toLowerCase()
      if (value.startsWith(normalized)) {
        options[idx]?.focus()
        return
      }
    }
  }

  private handleMenuKeydown(event: KeyboardEvent): void {
    const options = this.optionElements()
    if (options.length === 0) {
      return
    }

    const activeElement = document.activeElement as HTMLElement | null
    const currentIndex = options.findIndex((option) => option === activeElement)
    const safeIndex = currentIndex >= 0 ? currentIndex : 0

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.moveFocus(safeIndex, 1)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.moveFocus(safeIndex, -1)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      options[0]?.focus()
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      options[options.length - 1]?.focus()
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      this.closeMenu(true)
      return
    }
    if (event.key === 'Tab') {
      this.closeMenu(false)
      return
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      const value = options[safeIndex]?.dataset.multiOption
      if (!value) {
        return
      }
      this.toggleOption(value)
      this.pendingFocusValue = value
      this.emitChange()
      this.render()
      requestAnimationFrame(() => {
        this.focusOptionByValue(value, 'first')
      })
      return
    }
    if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1) {
      this.typeaheadBuffer += event.key.toLowerCase()
      this.focusByPrefix(this.typeaheadBuffer, safeIndex)
      if (this.typeaheadTimeout != null) {
        window.clearTimeout(this.typeaheadTimeout)
      }
      this.typeaheadTimeout = window.setTimeout(() => {
        this.typeaheadBuffer = ''
        this.typeaheadTimeout = null
      }, 500)
      return
    }
    if (event.key.toLowerCase() === 'a' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      const allSelected = this.selectedValues.size === this.options.length
      if (allSelected && this.minSelected() === 0) {
        this.selectedValues.clear()
      } else {
        this.selectedValues = new Set(this.options)
      }
      this.emitChange()
      this.render()
      requestAnimationFrame(() => {
        this.focusOptionByValue(options[safeIndex]?.dataset.multiOption ?? null, 'first')
      })
    }
  }

  private buildOptionButtons(): string {
    return this.options
      .map((option) => {
        const selected = this.selectedValues.has(option)
        return `
          <button
            type="button"
            role="option"
            aria-selected="${selected}"
            data-multi-option="${option}"
            class="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-neutral-900 transition-colors duration-100 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus motion-reduce:transition-none"
          >
            <span class="inline-flex h-4 w-4 items-center justify-center rounded-[3px] border text-[0.625rem] font-bold leading-none ${
              selected
                ? 'border-info-400 bg-info-100 text-info-700'
                : 'border-neutral-300 bg-neutral-0 text-transparent'
            }">✓</span>
            <span class="font-medium">${option}</span>
          </button>
        `
      })
      .join('')
  }

  private attachEventHandlers(): void {
    const disabled = this.hasAttribute('disabled')
    const trigger = this.querySelector<HTMLButtonElement>(`#${this.baseId}-trigger`)
    trigger?.addEventListener('click', () => {
      if (disabled) {
        return
      }
      if (this.isOpen) {
        this.closeMenu(false)
      } else {
        this.openMenu('selected')
      }
    })

    trigger?.addEventListener('keydown', (event) => {
      if (disabled) {
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        this.openMenu('selected')
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        this.openMenu('last')
        return
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.openMenu('selected')
      }
    })

    this.cleanupGlobalListeners()

    const menu = this.querySelector<HTMLElement>(`#${this.baseId}-menu`)
    menu?.addEventListener('keydown', (event) => {
      this.handleMenuKeydown(event)
    })
    menu?.addEventListener('click', (event) => {
      const target = event.target
      if (!(target instanceof Element)) {
        return
      }
      const option = target.closest<HTMLElement>('[data-multi-option]')
      const value = option?.dataset.multiOption
      if (!value) {
        return
      }
      this.toggleOption(value)
      this.pendingFocusValue = value
      this.emitChange()
      this.render()
      requestAnimationFrame(() => {
        this.focusOptionByValue(value, 'first')
      })
    })

    const handleMouseDown = (event: MouseEvent): void => {
      if (!this.isOpen) {
        return
      }
      const target = event.target
      if (target instanceof Node && this.contains(target)) {
        return
      }
      this.closeMenu(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    this.removeDocumentMouseDownListener = () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeMenu(true)
      }
    }
    document.addEventListener('keydown', handleKeydown)
    this.removeDocumentKeydownListener = () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }

  private render(): void {
    const disabled = this.hasAttribute('disabled')
    const disabledAttr = disabled ? 'disabled' : ''
    const ariaLabel = this.getAttribute('aria-label') ?? 'Multi select'

    this.className = 'block w-full'
    this.innerHTML = `
      <div class="relative">
        <button
          id="${this.baseId}-trigger"
          type="button"
          aria-label="${ariaLabel}"
          aria-haspopup="listbox"
          aria-expanded="${this.isOpen}"
          ${disabledAttr}
          class="flex w-full items-center justify-between rounded-lg border border-neutral-300 bg-neutral-0 px-3 py-2 text-left text-sm text-neutral-900 transition-colors duration-150 hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
        >
          <span class="truncate">${this.triggerLabel()}</span>
          <span class="ml-2 text-xs text-neutral-700">${this.isOpen ? '▴' : '▾'}</span>
        </button>

        ${
          this.isOpen
            ? `
          <div
            id="${this.baseId}-menu"
            role="listbox"
            aria-multiselectable="true"
            aria-label="${ariaLabel}"
            class="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-neutral-300 bg-neutral-0 p-1 shadow-[0_12px_24px_-16px_rgb(17_24_39_/_35%)]"
          >
            ${this.buildOptionButtons()}
          </div>
        `
            : ''
        }
      </div>
    `

    this.attachEventHandlers()
  }
}

defineElement('ds-multi-select', DsMultiSelect)

class DsHitlInterrupt extends HTMLElement {
  private readonly instanceId = `ds-hitl-${Math.random().toString(36).slice(2, 10)}`
  private versions: string[] = []
  private selectedDateAttribute: HitlDateAttribute = 'RDD Date'
  private selectedVersions = new Set<string>()

  static get observedAttributes(): string[] {
    return ['title', 'description', 'versions', 'selected-date-attribute', 'selected-versions']
  }

  connectedCallback(): void {
    this.syncStateFromAttributes()
    this.render()
  }

  attributeChangedCallback(): void {
    this.syncStateFromAttributes()
    this.render()
  }

  private syncStateFromAttributes(): void {
    this.versions = this.parseVersions(this.getAttribute('versions'))
    this.selectedDateAttribute = this.parseDateAttribute(this.getAttribute('selected-date-attribute'))
    this.selectedVersions = this.parseSelectedVersions(
      this.getAttribute('selected-versions'),
      this.versions,
    )
  }

  private parseVersions(raw: string | null): string[] {
    const fallback = ['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30']
    const parsed = parseCsvItems(raw).filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
    return parsed.length > 0 ? parsed : fallback
  }

  private parseDateAttribute(raw: string | null): HitlDateAttribute {
    if (raw === 'RDD Date' || raw === 'SO Date' || raw === 'POD Date') {
      return raw
    }
    return 'RDD Date'
  }

  private parseSelectedVersions(raw: string | null, versions: string[]): Set<string> {
    const selected = new Set(parseCsvItems(raw).filter((value) => versions.includes(value)))
    return selected.size > 0 ? selected : new Set(versions)
  }

  private payload(): { dateAttribute: HitlDateAttribute; versions: string[] } {
    return {
      dateAttribute: this.selectedDateAttribute,
      versions: Array.from(this.selectedVersions),
    }
  }

  private emitSelection(eventName: string): void {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: this.payload(),
        bubbles: true,
        composed: true,
      }),
    )
  }

  private selectedCountLabel(): string {
    return String(this.selectedVersions.size)
  }

  private attachEventHandlers(): void {
    const dateSelector = this.querySelector<HTMLElement>(`#${this.instanceId}-date-attribute`)
    dateSelector?.addEventListener('ds-single-select-change', (event: Event) => {
      const detail = (event as CustomEvent<{ value: string }>).detail
      this.selectedDateAttribute = this.parseDateAttribute(detail.value)
      this.emitSelection('ds-hitl-selection-change')
    })

    const versionSelector = this.querySelector<HTMLElement>(`#${this.instanceId}-version-selector`)
    versionSelector?.addEventListener('ds-multi-select-change', (event: Event) => {
      const detail = (event as CustomEvent<{ selected: string[] }>).detail
      this.selectedVersions = new Set(detail.selected.filter((value) => this.versions.includes(value)))
      if (this.selectedVersions.size === 0) {
        this.selectedVersions = new Set(this.versions)
      }

      const countValue = this.querySelector<HTMLElement>(`#${this.instanceId}-selected-count`)
      if (countValue) {
        countValue.textContent = this.selectedCountLabel()
      }

      this.emitSelection('ds-hitl-selection-change')
    })

    const acceptAllButton = this.querySelector<HTMLButtonElement>('[data-hitl-action="accept-all"]')
    acceptAllButton?.addEventListener('click', () => {
      this.emitSelection('ds-hitl-accept-all')
    })
  }

  private render(): void {
    const title = this.getAttribute('title') ?? 'Human Review Required'
    const description =
      this.getAttribute('description') ??
      'Conversation paused. Confirm these values before the workflow continues.'

    const dateOptions = HITL_DATE_ATTRIBUTE_OPTIONS.join(', ')
    const versionOptions = this.versions.join(', ')
    const selectedVersions = Array.from(this.selectedVersions).join(', ')

    this.className = 'block w-full'
    this.innerHTML = `
      <article class="w-full rounded-2xl border border-warning-400 bg-neutral-0 shadow-[0_10px_20px_-16px_rgb(17_24_39_/_14%)]">
        <header class="grid gap-2 border-b border-neutral-200 bg-warning-50/60 px-4 py-3">
          <div class="flex items-start gap-3">
            <span class="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-warning-400/45 bg-warning-50 text-warning-700">
              ${iconTag('triangle-alert', 'h-4 w-4')}
            </span>
            <div>
              <p class="m-0 text-sm font-semibold text-warning-700">${title}</p>
              <p class="m-0 mt-1 text-sm text-neutral-700">${description}</p>
            </div>
          </div>
        </header>

        <div class="grid gap-4 px-4 py-4">
          <section>
            <p class="m-0 text-sm font-semibold text-neutral-900">Date Attribute Selector</p>
            <p class="m-0 mt-1 text-xs text-neutral-700">Select one date attribute to continue.</p>
            <ds-single-select
              id="${this.instanceId}-date-attribute"
              options="${dateOptions}"
              value="${this.selectedDateAttribute}"
              aria-label="Date Attribute Selector"
            ></ds-single-select>
          </section>

          <section>
            <p class="m-0 text-sm font-semibold text-neutral-900">Version Selector</p>
            <p class="m-0 mt-1 text-xs text-neutral-700">Select one or more versions (yyyy-mm-dd).</p>
            <ds-multi-select
              id="${this.instanceId}-version-selector"
              options="${versionOptions}"
              selected="${selectedVersions}"
              min-selected="1"
              placeholder="Select versions"
              aria-label="Version Selector"
            ></ds-multi-select>
          </section>

          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-3">
            <p class="m-0 text-xs text-neutral-700">
              Selected versions:
              <span id="${this.instanceId}-selected-count" class="font-semibold text-neutral-900">${this.selectedCountLabel()}</span>
            </p>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                data-hitl-action="accept-all"
                class="inline-flex items-center justify-center rounded-[0.5rem] border border-brand bg-brand px-4 py-2 text-sm font-semibold text-neutral-0 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </article>
    `

    this.attachEventHandlers()
    hydrateIcons(this)
  }
}

defineElement('ds-hitl-interrupt', DsHitlInterrupt)

function buildLineChartSpec(): Record<string, unknown> {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    autosize: { type: 'fit-x', contains: 'padding' },
    width: 'container',
    height: 220,
    data: {
      values: [
        { month: 'Jan', revenue: 95 },
        { month: 'Feb', revenue: 108 },
        { month: 'Mar', revenue: 123 },
        { month: 'Apr', revenue: 118 },
        { month: 'May', revenue: 132 },
        { month: 'Jun', revenue: 147 },
      ],
    },
    mark: {
      type: 'line',
      strokeWidth: 3,
      color: '#1E1E1E',
      point: {
        filled: true,
        fill: '#27408B',
        stroke: '#27408B',
        size: 56,
      },
    },
    encoding: {
      x: {
        field: 'month',
        type: 'ordinal',
        axis: { labelAngle: 0, title: null },
      },
      y: {
        field: 'revenue',
        type: 'quantitative',
        axis: { title: 'Revenue (k USD)' },
      },
    },
    config: {
      background: '#FFFFFF',
      view: { stroke: null },
      axis: {
        labelColor: '#4B4B4B',
        titleColor: '#4B4B4B',
        domainColor: '#CFCFCF',
        tickColor: '#CFCFCF',
        gridColor: '#EFEFEF',
      },
    },
  }
}

function buildBarChartSpec(): Record<string, unknown> {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    autosize: { type: 'fit-x', contains: 'padding' },
    width: 'container',
    height: 220,
    data: {
      values: [
        { region: 'North America', revenue: 520 },
        { region: 'Europe', revenue: 380 },
        { region: 'Asia Pacific', revenue: 265 },
        { region: 'Latin America', revenue: 140 },
      ],
    },
    mark: {
      type: 'bar',
      cornerRadiusEnd: 5,
      color: '#27408B',
    },
    encoding: {
      x: {
        field: 'region',
        type: 'nominal',
        sort: '-y',
        axis: { labelAngle: -12, title: null },
      },
      y: {
        field: 'revenue',
        type: 'quantitative',
        axis: { title: 'Revenue (k USD)' },
      },
      tooltip: [
        { field: 'region', type: 'nominal', title: 'Region' },
        { field: 'revenue', type: 'quantitative', title: 'Revenue (k USD)' },
      ],
    },
    config: {
      background: '#FFFFFF',
      view: { stroke: null },
      axis: {
        labelColor: '#4B4B4B',
        titleColor: '#4B4B4B',
        domainColor: '#CFCFCF',
        tickColor: '#CFCFCF',
        gridColor: '#EFEFEF',
      },
    },
  }
}

async function renderVisualizationCharts(): Promise<void> {
  const lineTarget = document.getElementById('viz-line-chart')
  const barTarget = document.getElementById('viz-bar-chart')

  if (!lineTarget || !barTarget) {
    return
  }

  await Promise.all([
    embed(lineTarget, buildLineChartSpec() as any, { actions: false, renderer: 'svg' }),
    embed(barTarget, buildBarChartSpec() as any, { actions: false, renderer: 'svg' }),
  ])
}

function setupVisualizationPanelToggle(): void {
  const toggleButton = document.getElementById('toggle-visualization-panel')
  const workspaceColumns = document.getElementById('workspace-columns')
  const visualizationPanel = document.getElementById('visualization-panel')

  if (!toggleButton || !workspaceColumns || !visualizationPanel) {
    return
  }

  let isOpen = false
  let chartsRendered = false

  const setOpenState = (nextOpen: boolean): void => {
    isOpen = nextOpen
    visualizationPanel.classList.toggle('hidden', !nextOpen)
    workspaceColumns.classList.toggle('grid-cols-1', !nextOpen)
    workspaceColumns.classList.toggle('grid-cols-2', nextOpen)

    toggleButton.setAttribute('aria-pressed', String(nextOpen))
    toggleButton.setAttribute('aria-expanded', String(nextOpen))
    toggleButton.textContent = nextOpen ? 'Hide Visualization Panel' : 'Show Visualization Panel'

    if (nextOpen && !chartsRendered) {
      requestAnimationFrame(() => {
        void renderVisualizationCharts()
          .then(() => {
            chartsRendered = true
          })
          .catch((error: unknown) => {
            console.error('Failed to render visualization charts.', error)
          })
      })
    }
  }

  toggleButton.addEventListener('click', () => {
    setOpenState(!isOpen)
  })

  setOpenState(false)
}

function setupHitlInlineAlert(): void {
  const inlineAlert = document.getElementById('hitl-inline-alert')
  if (!inlineAlert) {
    return
  }

  const render = (isActive: boolean): void => {
    inlineAlert.classList.toggle('hidden', !isActive)
  }

  const hasInterrupt = (): boolean => Boolean(document.querySelector('ds-hitl-interrupt'))

  render(hasInterrupt())

  document.addEventListener(
    'ds-hitl-selection-change',
    () => {
      render(true)
    },
    true,
  )

  document.addEventListener(
    'ds-hitl-accept-all',
    () => {
      render(false)
    },
    true,
  )
}

hydrateIcons(document)
setupVisualizationPanelToggle()
setupHitlInlineAlert()
