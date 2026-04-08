import { ProcessCapturePanel } from '../../../rules/components/ProcessCapturePanel';
import type { WorkflowRequest } from '../../types';

type ProcessSectionProps = {
  request: WorkflowRequest;
};

export function ProcessSection({ request }: ProcessSectionProps) {
  return <ProcessCapturePanel parentType="request" parentId={request.id} />;
}
