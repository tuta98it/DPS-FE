export interface ISharedCaseStudy {
  casestudyId: string,
  hideInfo: boolean,
  time: number,
}
export const INIT_SHARED_CASE_STUDY : ISharedCaseStudy = {
  casestudyId: '',
  hideInfo: true,
  time: 4
};