import React from "react";
import "./scrumteamindex.css"

import { useScrumTeams } from "../../hooks/useScrumTeams.tsx"

/**
 * ScrumTeamIndex
 * @param {string} name
 * @param {string} placeholder
 * @param {React.ChangeEvent} onChange
 * @returns {string}
 */
export const ScrumTeamIndex = () => {

    const [scrumTeams, loadScrumTeams, deleteScrumTeams] = useScrumTeams();

    return (
        <>
        </>
    )
}
