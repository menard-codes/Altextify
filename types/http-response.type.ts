type SuccessResponse<D> = {
  type: "success";
  data: D;
};

type ErrorResponse<E> = {
  type: "error";
  details: E;
};

export type HttpResponse<D, E> = SuccessResponse<D> | ErrorResponse<E>;
