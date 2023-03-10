import React, { Component } from 'react';

export const useFetchMumbles = (params?: { limit?: number; offset?: number; newerThanMumbleId?: string }) => {
  const { limit, offset, newerThanMumbleId } = params || {};

  return {};
};
