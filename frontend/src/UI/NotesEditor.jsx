import React, { useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import axios from 'axios';
import { API_BASE_URL } from '../utils/Constants';

export default function NotesEditor({id, onNoteAdded}) {

    //TipTap Editor
  const imageInputRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Image],
  });

  const addImage = (event) => {
    const file = event.target.files[0];
    if(file & editor){
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().setImage({src: reader.result}).run()
      }
      reader.readAsDataURL(file);
    }
  }

  //Adding Internal note to cv
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const noteContent = editor.getHTML()
        const token = localStorage.getItem('authToken');
        const response = await axios.post(API_BASE_URL+`/cv/${id}/notes`, 
          {note: noteContent}, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": 'application/json'
            }
          }
        )
        editor.commands.clearContent();

        if(onNoteAdded){
          onNoteAdded(response.data);
        }
        console.log(response);
    }catch(error){
      console.log(error);
    }
  }

  return (
    <form  onSubmit={handleSubmit}>
        <div>
            <button type='button' onClick={()=> editor.chain().toggleBold().run()} className='btn px-1'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.8335 4.16675H10.8335C12.4443 4.16675 13.7502 5.47258 13.7502 7.08341C13.7502 8.69425 12.4443 10.0001 10.8335 10.0001H5.8335L5.8335 4.16675Z" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.8335 10H11.6668C13.2777 10 14.5835 11.3058 14.5835 12.9167C14.5835 14.5275 13.2777 15.8333 11.6668 15.8333H5.8335V10" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <button type='button' onClick={() => editor.chain().toggleItalic().run()} className='btn px-1'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.1665 4.16667H14.1665" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.8335 15.8334H10.8335" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.6668 4.16675L8.3335 15.8334" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <button type='button' onClick={() => editor.chain().toggleUnderline().run()} className="btn px-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5.8335 4.16675V8.33341C5.8335 10.6346 7.69898 12.5001 10.0002 12.5001C12.3013 12.5001 14.1668 10.6346 14.1668 8.33341V4.16675" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.1665 15.8334H15.8332" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <button type='button' onClick={() => editor.chain().toggleOrderedList().run()} className="btn px-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.1665 4.99992H16.6665" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.1665 9.99992H16.6665" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 14.9999H16.6667" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.3335 13.3334C3.3335 12.4129 4.07969 11.6667 5.00016 11.6667C5.92064 11.6667 6.66683 12.4129 6.66683 13.3334C6.66683 13.8259 6.25016 14.1667 5.8335 14.5834L3.3335 16.6667H6.66683" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.00016 8.33325V3.33325L3.3335 4.99992" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <button type='button' onClick={() => editor.chain().toggleBulletList().run()} className="btn px-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 4.99992H16.6667" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 9.99992H16.6667" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 14.9999H16.6667" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.16667 4.9999V5.00824" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.16667 9.9999V10.0082" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.16667 14.9999V15.0082" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <button type='button' onClick={()=> imageInputRef.current.click()} className='btn px-1'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.4999 6.66667H12.5082" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3.3335" y="3.33325" width="13.3333" height="13.3333" rx="3" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.3335 12.5L6.66683 9.16663C7.44033 8.42232 8.39333 8.42232 9.16683 9.16663L13.3335 13.3333" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.6665 11.6667L12.4998 10.8334C13.2733 10.0891 14.2263 10.0891 14.9998 10.8334L16.6665 12.5" stroke="#2F2B3D" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>     
        </div>                        
        <input type='file' accept='image/*' onChange={addImage} ref={imageInputRef} style={{display: 'none'}} />
        <div className="border rounded-md p-2 min-h-[200px]">
            <EditorContent editor={editor} />
        </div>
        <div className="d-flex align-items-center justify-content-end my-4">
            <button type="submit" className="btn btn-primary email-send-btn waves-effect waves-light">Save Note
                <i className="icon-base ti tabler-send icon-xs scaleX-n1-rtl ms-2"></i>
            </button>
        </div>
    </form>
  )
}
