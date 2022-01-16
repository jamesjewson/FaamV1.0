import React from 'react'
import Topbar from "../../components/topbar/Topbar"
import SettingsCenter from "../../components/settingsCenter/SettingsCenter"
import Sidebar from "../../components/sidebar/Sidebar"
import Rightbar from "../../components/rightbar/Rightbar"
import "./settings.css"


export default function Settings() {


    return (
        <>
        <Topbar />
            <div className="settingsWrapper">
                <Sidebar className="leftSettingsSidebar" />
                <SettingsCenter className="rightSettingsSidebar" />
                <Rightbar />
            </div>    
        </>
    )
}
