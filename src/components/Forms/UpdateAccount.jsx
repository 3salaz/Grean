import React from 'react'

function UpdateAccount() {
  return (
    <section className="h-full overflow-auto rounded-md w-full flex flex-col items-center justify-center">
                  {formData.accountType === "Driver" && (
                    <div id="driver" className="w-full p-4">
                      <h2 className="text-xl mb-4">Driver Info</h2>
                      <Button>
                        <a href={f1099msc} download="1099 Form">
                          Download 1099 Form
                        </a>
                      </Button>
                    </div>
                  )}
                  {formData.accountType === "User" && (
                    <div id="user" className="flex flex-col items-center justify-center h-full container px-8 text-center">
                      <h2 className="text-xl mb-2 font-bold">Location</h2>
                      <div>
                        <p className="text-sm">Select the type of location you'd like!</p>
                        <p className="text-xs pb-4">(This can be changed later in your settings)</p>
                      </div>

                      <Form.Item
                        name="locationType"
                        className="w-full flex flex-col gap-2"
                        rules={[
                          {
                            required: true,
                            message: "Please select the type of location you'd like",
                          },
                        ]}
                      >
                        <Radio.Group
                          className="w-full flex justify-center gap-4 text-center"
                          onChange={(e) => {
                            handleInputChange({ locationType: e.target.value });
                          }}
                        >
                          <Radio.Button className="basis-1/4 h-auto p-4 flex flex-col" value="Home">
                            <img className="object-fit" src={homeIcon} alt="Home" />
                            <div className="text-sm text-dark-green">Home</div>
                          </Radio.Button>
                          <Radio.Button className="basis-1/4 h-auto aspect-square p-4 flex flex-col" value="Business">
                            <img className="object-fit" src={businessIcon} alt="Business" />
                            <div className="text-sm text-dark-green">Business</div>
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>

                      <AnimatePresence>
                        {formData.locationType && (
                          <motion.div
                            key="locationForm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col w-full"
                          >
                            <Form.Item
                              label="Street"
                              name="street"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input your street address!",
                                },
                              ]}
                            >
                              <Input className="text-center" />
                            </Form.Item>
                            <Form.Item
                              label="City"
                              name="city"
                              rules={[
                                {
                                  required: true,
                                  message: "Please select your city!",
                                },
                              ]}
                            >
                              <Select>
                                <Select.Option value="Daly City">Daly City</Select.Option>
                                <Select.Option value="San Francisco">San Francisco</Select.Option>
                                <Select.Option value="South San Francisco">South San Francisco</Select.Option>
                              </Select>
                            </Form.Item>
                            <Form.Item
                              label="Location Name"
                              name="locationName"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input a name for your location!",
                                },
                              ]}
                            >
                              <Input placeholder="ex.San Francisco | Mission Location" />
                            </Form.Item>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </section>
  )
}

export default UpdateAccount