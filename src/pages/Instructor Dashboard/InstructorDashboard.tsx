import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/reducers';
import { AppDispatch } from '../../redux/store';
import useCurrentUser from '../../hooks/useCurrentUser';
import {
  getDashboardOverviewAction,
  getInstructorCoursesAction,
  getInstructorEarningsAction,
  getMyInstructorProfileAction,
  submitCourseForReviewAction,
  getActivityFeedAction,
  getEngagementHeatmapAction,
} from '../../redux/actions/instructorDashboardAction';
import {
  EarningsChart,
  InstructorCourseRow,
  InstructorProfileEditor,
} from '../../components/instructor';
import { Tabs, type TabItem, Skeleton, Surface, Button } from '../../ui';
import { PageLayout } from '../../patterns/PageLayout/PageLayout';
import { Reveal } from '../../patterns/Reveal/Reveal';
import { DataKPI } from '../../patterns/DataKPI/DataKPI';
import {
  EarningsCanvas,
  EngagementHeatmap,
  ActivityFeed,
} from '../../features/instructor';

type TabKey = 'overview' | 'courses' | 'earnings' | 'profile';

const TAB_LABELS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'courses', label: 'My Courses' },
  { key: 'earnings', label: 'Earnings' },
  { key: 'profile', label: 'Profile' },
];

const InstructorDashboard: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const initRef = useRef(true);

  const { user: userObj, isInstructor: isInstructorUser } = useCurrentUser();
  const userId: string = userObj?._id ?? '';


  const dashboardState = useSelector((state: RootState) => state.instructorDashboard);
  const { overview, instructorCourses, earnings, activityFeed, engagementHeatmap, instructorProfile, loading } = dashboardState;

  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  useEffect(() => {
    if (!isInstructorUser) {
      navigate('/');
      return;
    }

    if (initRef.current) {
      initRef.current = false;
      dispatch(getDashboardOverviewAction());
      dispatch(getMyInstructorProfileAction(userId));
      dispatch(getActivityFeedAction());
      dispatch(getEngagementHeatmapAction());
    }
  }, [dispatch, navigate, userId, isInstructorUser]);

  useEffect(() => {
    if (activeTab === 'courses' && instructorProfile?._id) {
      dispatch(getInstructorCoursesAction(instructorProfile._id));
    }
    if (activeTab === 'earnings' && instructorProfile?._id) {
      dispatch(getInstructorEarningsAction(instructorProfile._id));
    }
  }, [activeTab, dispatch, instructorProfile]);

  // Build monthly earnings chart data from raw earnings
  const earningsChartData = (() => {
    const map: Record<string, number> = {};
    earnings.forEach((e) => {
      const month = e.createdAt?.slice(0, 7) ?? '';
      if (month) map[month] = (map[month] ?? 0) + (e.netEarning ?? 0);
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, total]) => ({ month, total }));
  })();

  const tabItems: ReadonlyArray<TabItem<TabKey>> = TAB_LABELS.map(({ key, label }) => ({
    value: key,
    label,
  }));

  const renderOverview = () => {
    if (loading) {
      return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height='96px' />
          ))}
        </div>
      );
    }

    return (
      <div className='space-y-8'>
        {/* KPI band */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          <DataKPI
            label='Total Students'
            value={(overview?.totalStudents ?? 0).toLocaleString()}
            sparkline={earningsChartData.map((d) => d.total)}
          />
          <DataKPI
            label='Total Earnings'
            value={`$${(overview?.totalEarnings ?? 0).toFixed(2)}`}
            sparkline={earningsChartData.map((d) => d.total)}
          />
          <DataKPI
            label='This Month'
            value={`$${(overview?.thisMonthEarnings ?? 0).toFixed(2)}`}
          />
        </div>

        {/* Earnings canvas — full width */}
        <EarningsCanvas data={earningsChartData} />

        {/* Engagement heatmap + Activity feed — 2-col on lg+ */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <EngagementHeatmap data={engagementHeatmap.length > 0 ? engagementHeatmap : undefined} />
          <ActivityFeed items={activityFeed.length > 0 ? activityFeed : undefined} />
        </div>

        {/* Top courses table */}
        {overview?.byCourse && overview.byCourse.length > 0 && (
          <div className='rounded-card border border-line-subtle bg-bg-raised p-6 sm:p-8'>
            <header className='mb-6'>
              <span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
                Top courses
              </span>
              <h3
                className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
                style={{ fontVariationSettings: '"opsz" 32' }}
              >
                Performance by course
              </h3>
            </header>
            <div className='divide-y divide-line-subtle'>
              {overview.byCourse.map((c) => (
                <div key={c._id} className='flex items-center justify-between py-3 text-sm'>
                  <span className='text-ink-primary truncate flex-1 mr-4 font-body'>{c.courseTitle}</span>
                  <span className='text-ink-tertiary mr-6 tabular-nums font-body'>{c.enrollmentCount} students</span>
                  <span className='font-display font-semibold text-ink-primary tabular-nums'>${c.totalEarning.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCourses = () => {
    if (loading) {
      return (
        <div className='space-y-3'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height='96px' />
          ))}
        </div>
      );
    }

    if (!instructorCourses.data.length) {
      return (
        <Surface level='raised' className='py-16 px-6 text-center'>
          <p className='font-body text-sm text-ink-tertiary italic mb-5'>
            No courses yet. Create your first course to get started.
          </p>
          <div className='flex justify-center'>
            <Button variant='primary' size='md' onClick={() => navigate('/instructor/courses/new')}>
              Create new course
            </Button>
          </div>
        </Surface>
      );
    }

    return (
      <div className='space-y-3'>
        <div className='flex justify-end mb-2'>
          <Button variant='primary' size='sm' onClick={() => navigate('/instructor/courses/new')}>
            + New course
          </Button>
        </div>
        {instructorCourses.data.map((course) => (
          <InstructorCourseRow
            key={course._id}
            course={course}
            onSubmitReview={(id) => dispatch(submitCourseForReviewAction(id))}
          />
        ))}
      </div>
    );
  };

  const renderEarnings = () => {
    if (loading) {
      return <Skeleton height='192px' />;
    }

    return (
      <div className='space-y-6'>
        <Surface level='raised' className='p-6 sm:p-8'>
          <header className='mb-6'>
            <span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
              Trailing six months
            </span>
            <h3
              className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
              style={{ fontVariationSettings: '"opsz" 32' }}
            >
              Monthly earnings
            </h3>
          </header>
          <EarningsChart data={earningsChartData} />
        </Surface>

        {earnings.length > 0 && (
          <Surface level='raised' className='p-6 sm:p-8'>
            <header className='mb-6'>
              <span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
                Ledger
              </span>
              <h3
                className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
                style={{ fontVariationSettings: '"opsz" 32' }}
              >
                Recent transactions
              </h3>
            </header>
            <div className='divide-y divide-line-subtle'>
              {earnings.slice(0, 10).map((e) => (
                <div key={e._id} className='flex items-center justify-between py-3'>
                  <div>
                    <p className='font-body text-sm text-ink-primary'>
                      {e.courseId?.title ?? '—'}
                    </p>
                    <p className='font-mono text-2xs uppercase tracking-[0.12em] text-ink-tertiary mt-1'>
                      {e.createdAt?.slice(0, 10)}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='font-display font-semibold text-base text-ink-primary tabular-nums'>
                      ${e.netEarning.toFixed(2)}
                    </p>
                    <p
                      className={`font-mono text-2xs uppercase tracking-[0.12em] mt-1 ${
                        e.status === 'paid' ? 'text-signal-success' : 'text-signal-warning'
                      }`}
                    >
                      {e.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        )}
      </div>
    );
  };

  const renderProfile = () => (
    <Surface level='raised' className='p-6 sm:p-8'>
      <header className='mb-6'>
        <span className='font-mono text-2xs uppercase tracking-[0.18em] text-ink-tertiary'>
          Public profile
        </span>
        <h3
          className='mt-2 font-display font-semibold text-2xl text-ink-primary tracking-[-0.02em]'
          style={{ fontVariationSettings: '"opsz" 32' }}
        >
          How students see you.
        </h3>
      </header>
      <InstructorProfileEditor
        instructorId={instructorProfile?._id ?? ''}
        initialTitle={instructorProfile?.title ?? ''}
        initialExpertise={instructorProfile?.expertise ?? ''}
        initialDescription={instructorProfile?.description ?? ''}
      />
    </Surface>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'courses': return renderCourses();
      case 'earnings': return renderEarnings();
      case 'profile': return renderProfile();
    }
  };

  return (
    <PageLayout width='default' className='pt-16 sm:pt-24 pb-24'>
      <header className='mb-12'>
        <span className='font-mono text-2xs uppercase tracking-[0.22em] text-clay-400'>
          Studio
        </span>
        <Reveal
          mode='word-split'
          as='h1'
          className='mt-4 font-display font-semibold text-5xl sm:text-6xl text-ink-primary tracking-[-0.04em] leading-[0.95]'
        >
          Instructor dashboard.
        </Reveal>
      </header>
      <Tabs
        aria-label='Dashboard sections'
        items={tabItems}
        value={activeTab}
        onChange={setActiveTab}
        className='mb-8'
      />
      {renderTab()}
    </PageLayout>
  );
};

export default InstructorDashboard;
