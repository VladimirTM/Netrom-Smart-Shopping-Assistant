export interface ActivityLogModel {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  entityName: string;
  actorId?: number;
  actorEmail?: string;
  occurredAt: string;
}
