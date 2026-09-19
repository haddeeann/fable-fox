<template>
  <div v-if="editor" class="tiptap">
    <div class="flex flex-wrap gap-2">
      <base-button size="small" @click="pickImage" native-type="button">Image</base-button>
      <input ref="fileEl" type="file" accept="image/*" class="hidden" @change="onPick" />

      <base-button
        size="small"
        native-type="button"
        :type="fmt.bold ? 'primary' : 'default'"
        @click="editor.chain().focus().toggleBold().run()"

      >
        Bold
      </base-button>
      <base-button
        size="small"
        native-type="button"
        :type="fmt.italic ? 'primary' : 'default'"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        Italic
      </base-button>
      <base-button
        size="small"
        native-type="button"
        :type="fmt.strike ? 'primary' : 'default'"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        Strike
      </base-button>
      <!-- inline mark -->
      <base-button
        size="small"
        native-type="button"
        :type="editor.isActive('code') ? 'primary' : 'default'"
        :aria-pressed="editor.isActive('code')"
        @click="editor.chain().focus().toggleCode().run()"
      >
        Code
      </base-button>

      <!-- clearers (not toggles) -->
      <base-button size="small" native-type="button" @click="editor.chain().focus().unsetAllMarks().run()">
        Clear Marks
      </base-button>
      <base-button size="small" native-type="button" @click="editor.chain().focus().clearNodes().run()">
        Clear Nodes
      </base-button>

      <!-- paragraph toggle -->
      <base-button
        size="small"
        native-type="button"
        :type="editor.isActive('paragraph') ? 'primary' : 'default'"
        :aria-pressed="editor.isActive('paragraph')"
        @click="editor.chain().focus().setParagraph().run()"
      >
        Paragraph
      </base-button>

      <!-- headings -->
      <base-button
        v-for="level in headingLevels"
        :key="level"
        size="small"
        native-type="button"
        :type="editor.isActive('heading', { level }) ? 'primary' : 'default'"
        :aria-pressed="editor.isActive('heading', { level })"
        @click="editor.chain().focus().toggleHeading({ level }).run()"
      >
        H{{ level }}
      </base-button>

      <!-- lists -->
      <base-button
        size="small"
        native-type="button"
        :type="editor.isActive('bulletList') ? 'primary' : 'default'"
        :aria-pressed="editor.isActive('bulletList')"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        Bullet List
      </base-button>

      <base-button
        size="small"
        native-type="button"
        :type="editor.isActive('orderedList') ? 'primary' : 'default'"
        :aria-pressed="editor.isActive('orderedList')"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        Ordered List
      </base-button>

      <!-- blocks -->
      <base-button
        size="small"
        native-type="button"
        :type="editor.isActive('codeBlock') ? 'primary' : 'default'"
        :aria-pressed="editor.isActive('codeBlock')"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        Code Block
      </base-button>

      <base-button
        size="small"
        native-type="button"
        :type="editor.isActive('blockquote') ? 'primary' : 'default'"
        :aria-pressed="editor.isActive('blockquote')"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        Blockquote
      </base-button>

      <!-- inserts (not toggles) -->
      <base-button size="small" native-type="button" @click="editor.chain().focus().setHorizontalRule().run()">
        Horizontal Rule
      </base-button>
      <base-button size="small" @click="editor.chain().focus().setHardBreak().run()">
        Hard Break
      </base-button>

      <!-- history -->
      <base-button
        size="small"
        native-type="button"
        :disabled="!editor.can().chain().focus().undo().run()"
        @click="editor.chain().focus().undo().run()"
      >
        Undo
      </base-button>
      <base-button
        size="small"
        native-type="button"
        :disabled="!editor.can().chain().focus().redo().run()"
        @click="editor.chain().focus().redo().run()"
      >
        Redo
      </base-button>

      <!-- color example -->
      <base-button
        size="small"
        native-type="button"
        :type="editor.isActive('textStyle', { color: '#958DF1' }) ? 'primary' : 'default'"
        :aria-pressed="editor.isActive('textStyle', { color: '#958DF1' })"
        @click="editor.chain().focus().setColor('#958DF1').run()"
      >
        Purple
      </base-button>
    </div>

    <EditorContent
      :editor="editor"
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { watch, reactive, onMounted, onBeforeUnmount, ref } from 'vue'
import { Extension } from '@tiptap/core'
import BaseButton from '@/components/BaseButton.vue'
import Image from '@tiptap/extension-image'
import { uploadImage } from '@/api/axios'

// Accept v-model binding
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const headingLevels = [1, 2, 3, 4, 5, 6] as const

const StrikeShortcut = Extension.create({
  name: 'strikeShortcut',
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-x': () => this.editor.chain().focus().toggleStrike().run(),
    }
  },
})

// a hidden file input template
const fileEl = ref<HTMLInputElement | null>(null)
function pickImage () {
  fileEl.value?.click()
}

async function onPick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const url = await uploadImage(file)
  editor.value?.chain().focus().setImage({ src: url, alt: file.name }).run()
}

// Initialize the editor
const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Image.configure({ HTMLAttributes: { loading: 'lazy' } }),
    StrikeShortcut,
    TextStyle,
    Color.configure({ types: ['textStyle'] }),
  ],
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    handlePaste(view, event) {
      const file = Array.from(event.clipboardData?.files || [])[0]
      if (file && file.type.startsWith('image/')) {
        uploadImage(file).then(url => {
          editor?.value?.chain().focus().setImage({ src: url, alt: file.name }).run()
        })
        return true
      }
      return false
    },
    handleDrop(view, event) {
      const file = Array.from(event.dataTransfer?.files || [])[0]
      if (file && file.type.startsWith('image/')) {
        uploadImage(file).then(url => {
          editor?.value?.chain().focus().setImage({ src: url, alt: file.name }).run()
        })
        return true
      }
      return false
    }
  }
})

// reactive “format bar” state
const fmt = reactive({ bold: false, italic: false, strike: false, purple: false })

const updateActive = () => {
  const e = editor.value
  if (!e) return
  fmt.bold = e.isActive('bold')
  fmt.italic = e.isActive('italic')
  fmt.strike = e.isActive('strike')
  fmt.purple = e.isActive('textStyle', { color: '#958DF1' }) // example w/ attributes
}



// Watch for changes to modelValue and update the editor content
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && editor.value && editor.value.getHTML() !== newValue) {
      editor.value.commands.setContent(newValue, { emitUpdate: false })
    }
  }
)

onMounted(() => {
  // selection moves, stored marks change, typing happens → keep buttons in sync
  editor.value?.on('selectionUpdate', updateActive)
  editor.value?.on('transaction', updateActive)
  editor.value?.on('update', updateActive)
  updateActive()
})

onBeforeUnmount(() => {
  editor.value?.off('selectionUpdate', updateActive)
  editor.value?.off('transaction', updateActive)
  editor.value?.off('update', updateActive)
})
</script>


<style>
.tiptap {
  margin-top: 1rem;
}

div[contenteditable="true"] {
  min-height: 500px;
  width: 100%;
  padding: 0.75rem;
  box-sizing: border-box;
  outline: none;
  border: 1px solid #d1d5db; /* Tailwind gray-300 */
  border-radius: 0.375rem;
  background: white;
}


.tiptap ul,
.tiptap ol {
  padding-left: 1.25rem;
}

.tiptap h1,
.tiptap h2,
.tiptap h3,
.tiptap h4,
.tiptap h5,
.tiptap h6 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.tiptap pre {
  background: #333;
  color: #fff;
  border-radius: 0.4rem;
  padding: 0.75rem 1rem;
  overflow-x: auto;
}

.tiptap code {
  background: #eee;
  border-radius: 0.25rem;
  padding: 0.2em 0.4em;
}

.tiptap strong { font-weight: 700; }
.tiptap em { font-style: italic; }
.tiptap s { text-decoration: line-through; } /* or .tiptap del */

</style>
