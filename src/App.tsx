import { useEffect, useState } from 'react'

type Stage = 'Applied' | 'Interview' | 'Offer' | 'Rejected'
type StageFilter = 'All' | Stage

type Application = {
  id: string
  company: string
  role: string
  date: string
  stage: Stage
}

const STORAGE_KEY = 'job-application-tracker'

const stageOptions: Stage[] = ['Applied', 'Interview', 'Offer', 'Rejected']

const starterApplications: Application[] = [
  {
    id: 'starter-1',
    company: 'Northstar Labs',
    role: 'Frontend Developer',
    date: '2026-10-08',
    stage: 'Applied',
  },
  {
    id: 'starter-2',
    company: 'BrightPath Studio',
    role: 'Junior Software Engineer',
    date: '2026-10-11',
    stage: 'Interview',
  },
  {
    id: 'starter-3',
    company: 'Harbor Systems',
    role: 'UI Engineer',
    date: '2026-10-14',
    stage: 'Offer',
  },
]

export default function App() {
  const [applications, setApplications] = useState<Application[]>(() => {
    const savedApplications = window.localStorage.getItem(STORAGE_KEY)
    return savedApplications
      ? (JSON.parse(savedApplications) as Application[])
      : starterApplications
  })
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [date, setDate] = useState('')
  const [stage, setStage] = useState<Stage>('Applied')
  const [stageFilter, setStageFilter] = useState<StageFilter>('All')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  }, [applications])

  const activeCount = applications.filter(
    (application) =>
      application.stage === 'Applied' || application.stage === 'Interview',
  ).length
  const interviewCount = applications.filter(
    (application) => application.stage === 'Interview',
  ).length
  const offerCount = applications.filter(
    (application) => application.stage === 'Offer',
  ).length

  const filteredApplications = applications.filter(
    (application) =>
      stageFilter === 'All' || application.stage === stageFilter,
  )


  function updateStage(id: string, nextStage: Stage) {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === id
          ? { ...application, stage: nextStage }
          : application,
      ),
    )
  }

   function removeApplication(id: string) {
    setApplications((currentApplications) =>
      currentApplications.filter((application) => application.id !== id),
    )
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Career dashboard</p>
        <h1>Job Application Tracker</h1>
        <p>Track every opportunity from first application to final decision.</p>
      </header>
            <section className="summary-grid" aria-label="Application summary">
        <article className="summary-card">
          <span>Total</span>
          <strong>{applications.length}</strong>
        </article>
        <article className="summary-card">
          <span>Active</span>
          <strong>{activeCount}</strong>
        </article>
        <article className="summary-card">
          <span>Interviews</span>
          <strong>{interviewCount}</strong>
        </article>
        <article className="summary-card">
          <span>Offers</span>
          <strong>{offerCount}</strong>
        </article>
              
      </section>
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">New opportunity</p>
            <h2>Add an application</h2>
          </div>
        </div>

        <form
          className="application-form"
          onSubmit={(event) => {
            event.preventDefault()
            if (!company.trim() || !role.trim() || !date) {
              return
            }

            const newApplication: Application = {
              id: String(Date.now()),
              company: company.trim(),
              role: role.trim(),
              date,
              stage,
            }

            setApplications((currentApplications) => [
              newApplication,
              ...currentApplications,
            ])
            setCompany('')
            setRole('')
            setDate('')
            setStage('Applied')
          }}
        >
          <label>
            Company
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Example Company"
              required
            />
          </label>
                    <label>
            Role
            <input
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="Frontend Developer"
              required
            />
          </label>
          <label>
            Application date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </label>
                    <label>
            Stage
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value as Stage)}
            >
              {stageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <button className="primary-button" type="submit">
            Add application
          </button>
        </form>
      </section>
            <section className="panel">
        <div className="section-heading list-heading">
          <div>
            <p className="eyebrow">Pipeline</p>
            <h2>Your applications</h2>
          </div>
          <label className="filter-control">
            Filter by stage
            <select
              value={stageFilter}
              onChange={(event) =>
                setStageFilter(event.target.value as StageFilter)
              }
            >
              <option value="All">All</option>
              {stageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Applied</th>
                <th>Stage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
                                            {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                
                <tr key={application.id}>
                  <td data-label="Company">{application.company}</td>
                  <td data-label="Role">{application.role}</td>
                  <td data-label="Applied">{application.date}</td>
                                      <td data-label="Stage">
                      <select
                        className={`stage-select stage-${application.stage.toLowerCase()}`}
                        aria-label={`Update stage for ${application.company}`}
                        value={application.stage}
                        onChange={(event) =>
                          updateStage(
                            application.id,
                            event.target.value as Stage,
                          )
                        }
                      >
                        {stageOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td data-label="Action">
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => removeApplication(application.id)}
                      >
                        Remove
                      </button>
                    </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td className="empty-state" colSpan={5}>
                    No applications match this stage.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

