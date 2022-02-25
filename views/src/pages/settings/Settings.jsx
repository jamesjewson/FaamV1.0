import React from 'react'
import SettingsCenter from "../../components/settingsCenter/SettingsCenter"
import Sidebar from "../../components/sidebar/Sidebar"
import "./settings.css"


export default function Settings() {


    return (
        <>
            <div className="settingsWrapper">
                <Sidebar className="leftSettingsSidebar" />
                <SettingsCenter className="rightSettingsSidebar" />
            </div>    
        </>
    )
}
