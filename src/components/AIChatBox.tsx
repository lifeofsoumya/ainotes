import { cn } from '@/lib/utils'
import { useChat } from 'ai/react'
import { XCircle } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Message } from 'ai'

interface AIChatBoxProps {
    open: boolean,
    onClose: () => void
}

export default function AIChatBox({open, onClose} : AIChatBoxProps) {
    const { 
        messages,
        input,
        handleInputChange,
        handleSubmit,
        setMessages,
        isLoading,
        error
     } = useChat()

     return <div className={cn('bottom-0 right-0 xl:right-36 z-10 w-full max-w-[500px] p-1', open ? "fixed" : "hidden")}>
        
        <div className='flex h-screen md:h-[600px] flex-col rounded bg-background border shadow-xl'>
            <div className='h-full'>
                {messages.map(message=>(
                    <ChatMessage message={message} key={message.id} />
                ))}
            </div>
            <button onClick={onClose} className='absolute top-3 right-3'>
                <XCircle size={30} />
            </button>
            <form onSubmit={handleSubmit} className='m-3 flex gap-1'>
                <Input 
                    value={input}
                    className='focus:outline-none'
                    onChange={handleInputChange}
                    placeholder='Ask something...'
                />
                <Button type="submit">Send</Button>
            </form>
        </div>
     </div>
}

function ChatMessage({message: {role, content}}: {message: Message}){
    return <div className='mb-3'>
        <div>{role}</div>
        <div>{content}</div>
    </div>
}