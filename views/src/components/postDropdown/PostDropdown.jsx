import React from 'react'
import "./postDropdown.css"

export default function PostDropdown({confirmDelete, editPost}) {
    return (
        <>
           <ul className="postDropdownMenu">
                <li className="postDropdownMenuItem" onClick={editPost}>Edit</li>
                <li className="postDropdownMenuItem" onClick={confirmDelete}>Delete</li>
            </ul> 
        </>
    )
}
