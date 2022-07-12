import {useEffect, useCallback, useState, useMemo} from 'react';

import {
  useProductOptions,
  isBrowser,
  useUrl,
  AddToCartButton,
  Money,
  ShopPayButton,
} from '@shopify/hydrogen';

import {Heading, Text, Button, ProductOptions} from '~/components';

export function ProductForm({data = {}}) {
  const {pathname, search} = useUrl();
  const [params, setParams] = useState(new URLSearchParams(search));

  const {options, setSelectedOption, selectedOptions, selectedVariant} =
    useProductOptions();
  const isOutOfStock = !selectedVariant?.availableForSale || false;
  const isOnSale =
    selectedVariant?.priceV2?.amount <
      selectedVariant?.compareAtPriceV2?.amount || false;

  useEffect(() => {
    const widgetScript = document.createElement('script');
    widgetScript.setAttribute(
      'src',
      'https://cnstatic.devcb.in/static/app-static-assets/cb-ecom-vue/widget/js/index.js',
    );
    document.head.appendChild(widgetScript);
  }, []);

  const productHashJson = useMemo(() => {
    if (data.sellingPlanGroups) {
      return JSON.stringify({
        ...data,
        requires_selling_plan: data.requiresSellingPlan,
        selling_plan_groups: data.sellingPlanGroups,
      });
    }
    return null;
  }, [data]);

  useEffect(() => {
    if (params || !search) return;
    setParams(new URLSearchParams(search));
  }, [params, search]);

  useEffect(() => {
    options.map(({name, values}) => {
      if (!params) return;
      const currentValue = params.get(name.toLowerCase()) || null;
      if (currentValue) {
        const matchedValue = values.filter(
          (value) => encodeURIComponent(value.toLowerCase()) === currentValue,
        );
        setSelectedOption(name, matchedValue[0]);
      } else {
        params.set(
          encodeURIComponent(name.toLowerCase()),
          encodeURIComponent(selectedOptions[name].toLowerCase()),
        ),
          window.history.replaceState(
            null,
            '',
            `${pathname}?${params.toString()}`,
          );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useCallback(
    (name, value) => {
      setSelectedOption(name, value);
      if (!params) return;
      params.set(
        encodeURIComponent(name.toLowerCase()),
        encodeURIComponent(value.toLowerCase()),
      );
      if (isBrowser()) {
        window.history.replaceState(
          null,
          '',
          `${pathname}?${params.toString()}`,
        );
      }
    },
    [setSelectedOption, params, pathname],
  );

  return (
    <form className="grid gap-10">
      {
        <div className="grid gap-4">
          {options.map(({name, values}) => {
            if (values.length === 1) {
              return null;
            }
            return (
              <div
                key={name}
                className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0"
              >
                <Heading as="legend" size="lead" className="min-w-[4rem]">
                  {name}
                </Heading>
                <div className="flex flex-wrap items-baseline gap-4">
                  <ProductOptions
                    name={name}
                    handleChange={handleChange}
                    values={values}
                  />
                </div>
              </div>
            );
          })}
        </div>
      }
      {productHashJson && (
        <div
          data-product={productHashJson}
          data-currency="$"
          data-cb_config='{"primaryTextColor":"#725327","bgColor":"#FFFFFF","secondaryTextColor":"#64648C","highlightColor":"#7f4210"}'
          id="cb-widget-container"
        >
          <div id="cb-widget">
            <div className="cb-widget-loader">
              <div className="cb-row cb-border-bottom">
                <div style={{padding: '16px'}}>
                  <div
                    className="cb-circle-loader cb-loader-animate"
                    style={{display: 'inline-block'}}
                  ></div>
                  <div
                    className="cb-bar-loader cb-loader-animate"
                    style={{
                      width: '150px',
                      height: '24px',
                      display: 'inline-block',
                    }}
                  ></div>
                </div>
                <div style={{padding: '9px 16px'}}>
                  <div
                    className="cb-bar-loader cb-loader-animate"
                    style={{width: '80px', height: '18px', marginBottom: '2px'}}
                  ></div>
                  <div
                    className="cb-bar-loader cb-loader-animate"
                    style={{
                      width: '28px',
                      height: '18px',
                      marginBottom: 'auto',
                    }}
                  ></div>
                </div>
              </div>
              <div className="cb-container">
                <div className="cb-row">
                  <div style={{padding: '16px'}}>
                    <div
                      className="cb-circle-loader cb-loader-animate"
                      style={{display: 'inline-block'}}
                    ></div>
                    <div
                      className="cb-bar-loader cb-loader-animate"
                      style={{
                        width: '150px',
                        height: '24px',
                        display: 'inline-block',
                      }}
                    ></div>
                  </div>
                  <div style={{padding: '9px 16px'}}>
                    <div
                      className="cb-bar-loader cb-loader-animate"
                      style={{
                        width: '80px',
                        height: '18px',
                        marginBottom: '2px',
                      }}
                    ></div>
                    <div
                      className="cb-bar-loader cb-loader-animate"
                      style={{
                        width: '28px',
                        height: '18px',
                        marginBottom: 'auto',
                      }}
                    ></div>
                  </div>
                </div>
                <div className="cb-body">
                  <div className="cb-hero-content">
                    <div
                      className="cb-bar-loader cb-loader-animate"
                      style={{
                        width: '150px',
                        height: '20px',
                        marginBottom: '8px',
                      }}
                    ></div>
                    <div
                      className="cb-bar-loader cb-loader-animate"
                      style={{
                        width: '100%',
                        height: '38px',
                        marginLeft: 'auto',
                      }}
                    ></div>
                  </div>
                  <div className="cb-desc-content">
                    <div
                      className="cb-bar-loader cb-loader-animate"
                      style={{
                        width: '100%',
                        height: '20px',
                        marginBottom: '8px',
                      }}
                    ></div>
                    <div
                      className="cb-bar-loader cb-loader-animate"
                      style={{
                        width: '216px',
                        height: '20px',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid items-stretch gap-4">
        <AddToCartButton
          variantId={selectedVariant?.id}
          quantity={1}
          accessibleAddingToCartLabel="Adding item to your cart"
          disabled={isOutOfStock}
        >
          <Button
            width="full"
            variant={isOutOfStock ? 'secondary' : 'primary'}
            as="span"
          >
            {isOutOfStock ? (
              <Text>Sold out</Text>
            ) : (
              <Text
                as="span"
                className="flex items-center justify-center gap-2"
              >
                <span>Add to bag</span> <span>·</span>{' '}
                <Money
                  withoutTrailingZeros
                  data={selectedVariant.priceV2}
                  as="span"
                />
                {isOnSale && (
                  <Money
                    withoutTrailingZeros
                    data={selectedVariant.compareAtPriceV2}
                    as="span"
                    className="opacity-50 strike"
                  />
                )}
              </Text>
            )}
          </Button>
        </AddToCartButton>
        {!isOutOfStock && <ShopPayButton variantIds={[selectedVariant.id]} />}
      </div>
    </form>
  );
}
