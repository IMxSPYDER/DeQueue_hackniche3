import React from 'react'
import CampaignList from './CampaignList'
import CrowdfundingStats from '../Components/CrowdfundingStats'

function AllCampaign() {
  return (
    <div className='mx-auto bg-black'>
        <CrowdfundingStats/>
      <CampaignList/>
    </div>
  )
}

export default AllCampaign
