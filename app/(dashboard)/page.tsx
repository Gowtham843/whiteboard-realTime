"use client";
import { useOrganization } from '@clerk/nextjs';
import { EmpytyOrg } from './_components/sidebar/EmpytyOrg';
import { BoardList } from './_components/boardList';


interface DashBoardPageProps {
  searchParams: {
    search?: string
    favorites?: string
  };
};

const DashBoardPage = ({
  searchParams
}: DashBoardPageProps) => {
  const { organization } = useOrganization();

  return (
    <div className='flex-1 h-[calc(100%-80px)] p-6'>
      {!organization ? (
        // if organization is Empty this page will be show and it is a startup screen also
        <EmpytyOrg />
      ) : (

        // sending sercah values in url to BoardList page, as favorites organization is also showed in url it is also send to check as per that 80% of screen is displayed
        <BoardList
          orgId={organization.id}
          query={searchParams}
        />
      )}
    </div>
  )
}

export default DashBoardPage;
