import {  DashboardLayout } from '@/layouts/dashboardLayout/dashboardLayout'
import TextArea from '@/components/textArea/textArea'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { useQueries } from 'react-query'
import { Cvs } from '@/requests/cvs'

const Resume = () => {
    const [resume, setResume] = useState<string | null>(null)
    const [objectives, setObjectives] = useState<string | null>(null)
    const router = useRouter()
    const user = useSelector((state: RootState) => state.user.user);
    const { id } = router.query;

    const [resumeQuery, objectivesQuery, sendResume, sendObjectives] = useQueries([
        {
          queryKey: 'resumeQuery',
          queryFn: async () => {
            const response = await new Cvs().getSpecifFieldOfASpecificCv(
                "resume", 
                id as string, 
            )

            const json = JSON.parse(response)
            return json

          }, 
          enabled: false
        },
        {
            queryKey: 'objectivesQuery',
            queryFn: async () => {
              const response = await new Cvs().getSpecifFieldOfASpecificCv(
                  "objectives", 
                  id as string, 
              )
  
              const json = JSON.parse(response)
              console.log(json)
              return json
  
            }, 
            enabled: false
          },
          {
            queryKey: 'sendResume',
            queryFn: async () => {
              if(!resume) return
  
              const response = await new Cvs().updateCvField(
                  "resume", 
                  id as string, 
                  resume
              )
  
              const json = JSON.parse(response)
              return json
  
            }, 
            enabled: false
          },
          {
            queryKey: 'sendObjectives',
            queryFn: async () => {
              if(!objectives) return
  
              const response = await new Cvs().updateCvField(
                  "objectives", 
                  id as string, 
                  objectives
              )
  
              const json = JSON.parse(response)
              return json
  
            }, 
            enabled: false
          },
    ])

    useEffect(() => {
        if(!user) router.push('/middlewarePage')

        resumeQuery.refetch()
        objectivesQuery.refetch()
       
    }, [])

    useEffect(() => {
    }, [resumeQuery])

    useEffect(() => {
        sendResume.refetch()
    }, [resume])

    useEffect(() => {
        sendObjectives.refetch()
    }, [objectives])


    return (
        <DashboardLayout
            main={
                <div id="resume" className="steps">
                        <div className='resume'>
                            <h1>Resume</h1>
                            <h2>Write here a RESUME of your career</h2><br />
                            <TextArea
                                initialTXT={String(resumeQuery.data)}
                                onDataReceived={setResume}
                            />
                        </div>

                        <div className='objective'>
                            <h1>Write here your OBJECTIVES</h1><br />
                            <TextArea
                                initialTXT={String(objectivesQuery.data)}
                                onDataReceived={setObjectives}
                            />
                        </div>
                </div>
            }

            nextRouter={`../${id}/skills`}
            previousRouter={`../${id}/social-medias`}
        />
    )
}

export default Resume