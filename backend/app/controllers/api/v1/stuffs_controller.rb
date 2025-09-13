class Api::V1::StuffsController < ApplicationController
  before_action :set_stuff, only: [ :show, :update, :destroy ]

  # GET /api/v1/stuffs
  def index
    @stuffs = Stuff.all
    render json: @stuffs
  end

  # GET /api/v1/stuffs/:id
  def show
    render json: @stuff
  end

  # POST /api/v1/stuffs
  def create
    @stuff = Stuff.new(stuff_params)

    if @stuff.save
      render json: @stuff, status: :created
    else
      render json: @stuff.errors, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/stuffs/:id
  def update
    if @stuff.update(stuff_params)
      render json: @stuff
    else
      render json: @stuff.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/stuffs/:id
  def destroy
    @stuff.destroy
    head :no_content
  end

  private

  def set_stuff
    @stuff = Stuff.find(params[:id])
  end

  def stuff_params
    params.require(:stuff).permit(:name)
  end
end
